/* eslint-disable*/
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './../../usuario/services/usuario.service';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UsuarioLogin } from '../entities/usuariologin.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const buscaUsuario = await this.usuarioService.findByUsuario(username);

    if (!buscaUsuario) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    const matchPassword = await this.bcrypt.compararSenhas(
      password,
      buscaUsuario.senha,
    );

    if (!matchPassword) {
      throw new UnauthorizedException('Senha incorreta!');
    }

    // Remove a senha do objeto de retorno
    const { senha, ...usuarioSemSenha } = buscaUsuario;
    return usuarioSemSenha;
  }

  async login(usuarioLogin: UsuarioLogin) {
    console.log('🔐 Tentativa de login para:', usuarioLogin.usuario);

    try {
      // Valida o usuário e senha
      const usuarioValidado = await this.validateUser(
        usuarioLogin.usuario,
        usuarioLogin.senha,
      );

      if (!usuarioValidado) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      // Cria o payload do JWT
      const payload = {
        sub: usuarioValidado.id,
        username: usuarioValidado.usuario,
        nome: usuarioValidado.nome,
        isMasterAdmin: usuarioValidado.isMasterAdmin || false,
      };

      // Gera o token
      const token = this.jwtService.sign(payload);

      console.log('✅ Login realizado com sucesso para:', usuarioValidado.usuario);

      // Retorna a resposta formatada
      return {
        id: usuarioValidado.id,
        nome: usuarioValidado.nome,
        usuario: usuarioValidado.usuario,
        endereco: usuarioValidado.endereco,
        cep: usuarioValidado.cep || '', // Adicione o CEP aqui
        objetivo: usuarioValidado.objetivo,
        foto: usuarioValidado.foto,
        senha: '', // Sempre retorna vazio por segurança
        isMasterAdmin: usuarioValidado.isMasterAdmin || false,
        token: `Bearer ${token}`,
      };

    } catch (error) {
      console.error('❌ Erro no login:', error);

      // Se já for uma HttpException, apenas propague
      if (error instanceof HttpException) {
        throw error;
      }

      // Para outros erros, lance uma Internal Server Error
      throw new HttpException(
        'Erro interno no servidor durante o login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
