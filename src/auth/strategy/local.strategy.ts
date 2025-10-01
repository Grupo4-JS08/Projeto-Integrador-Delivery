/* eslint-disable*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'usuario',  // Nome do campo no JSON
      passwordField: 'senha',    // Nome do campo no JSON
    });
    console.log('✅ LocalStrategy configurado com:', {
      usernameField: 'usuario',
      passwordField: 'senha'
    });
  }

  async validate(usuario: string, senha: string): Promise<any> {
    console.log('🔐 LocalStrategy validate chamado:', { usuario, senha: '***' });

    try {
      const validaUsuario = await this.authService.validateUser(usuario, senha);

      if (!validaUsuario) {
        console.log('❌ Usuário não validado');
        throw new UnauthorizedException('Usuário e/ou senha incorretos!');
      }

      console.log('✅ Usuário validado no LocalStrategy');
      return validaUsuario;
    } catch (error) {
      console.error('❌ Erro no LocalStrategy:', error);
      throw error;
    }
  }
} 
