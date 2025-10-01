/* eslint-disable*/
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`🔍 Validando usuário: ${username}`);

    try {
      const buscaUsuario = await this.usuarioService.findByUsuario(username);
      this.logger.log(`Usuário encontrado no banco: ${!!buscaUsuario}`);

      if (!buscaUsuario) {
        this.logger.warn(`Usuário não encontrado: ${username}`);
        throw new UnauthorizedException('Usuário não encontrado!');
      }

      this.logger.log(`Comparando senhas...`);
      const matchPassword = await this.bcrypt.compararSenhas(
        password,
        buscaUsuario.senha,
      );

      this.logger.log(`Senha válida: ${matchPassword}`);

      if (!matchPassword) {
        this.logger.warn(`Senha incorreta para usuário: ${username}`);
        throw new UnauthorizedException('Senha incorreta!');
      }

      // Remove a senha do objeto de retorno
      const { senha, ...usuarioSemSenha } = buscaUsuario;
      this.logger.log(`✅ Usuário validado com sucesso: ${username}`);

      return usuarioSemSenha;
    } catch (error) {
      this.logger.error(`❌ Erro na validação do usuário: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async login(usuarioLogin: UsuarioLogin) {
    this.logger.log(`🔐 Tentativa de login para: ${usuarioLogin.usuario}`);

    try {
      // Valida o usuário e senha
      const usuarioValidado = await this.validateUser(
        usuarioLogin.usuario,
        usuarioLogin.senha,
      );

      this.logger.log(`✅ Usuário autenticado, gerando JWT...`);

      // Cria o payload do JWT
      const payload = {
        sub: usuarioValidado.id,
        username: usuarioValidado.usuario,
        nome: usuarioValidado.nome,
        isMasterAdmin: usuarioValidado.isMasterAdmin || false,
      };

      // Gera o token
      const token = this.jwtService.sign(payload);
      this.logger.log(`✅ JWT gerado com sucesso`);

      // Retorna a resposta formatada
      const resposta = {
        id: usuarioValidado.id,
        nome: usuarioValidado.nome,
        usuario: usuarioValidado.usuario,
        endereco: usuarioValidado.endereco,
        cep: usuarioValidado.cep || '',
        objetivo: usuarioValidado.objetivo,
        foto: usuarioValidado.foto,
        senha: '',
        isMasterAdmin: usuarioValidado.isMasterAdmin || false,
        token: `Bearer ${token}`,
      };

      this.logger.log(`✅ Login realizado com sucesso para: ${usuarioValidado.usuario}`);
      return resposta;

    } catch (error) {
      this.logger.error(`❌ Erro no login: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);

      // Se já for uma HttpException, apenas propague
      if (error instanceof HttpException) {
        throw error;
      }

      // Para outros erros, lance uma Internal Server Error
      throw new HttpException(
        `Erro interno no servidor durante o login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
