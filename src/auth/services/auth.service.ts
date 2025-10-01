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

async login(usuarioValidado: any) {
  const payload = {
    sub: usuarioValidado.id,
    username: usuarioValidado.usuario,
    nome: usuarioValidado.nome,
    isMasterAdmin: usuarioValidado.isMasterAdmin || false,
  };

  const token = this.jwtService.sign(payload);

  return {
    ...usuarioValidado,
    senha: '', // nunca retornar senha
    token: `Bearer ${token}`,
  };
}
}
