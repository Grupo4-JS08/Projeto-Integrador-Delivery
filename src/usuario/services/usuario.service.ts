/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: {
        usuario: usuario,
      },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id,
      },
    });

    if (!usuario)
      throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

    return usuario;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const buscaUsuario = await this.findByUsuario(usuario.usuario);

    if (buscaUsuario)
      throw new HttpException('O Usuario já existe!', HttpStatus.BAD_REQUEST);

    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);

    return await this.usuarioRepository.save(usuario);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    await this.findById(usuario.id);

    if (!usuario.id)
      throw new HttpException('Id não informado!', HttpStatus.BAD_REQUEST);

    const buscaUsuario = await this.findByUsuario(usuario.usuario);

    if (buscaUsuario && buscaUsuario.id !== usuario.id)
      throw new HttpException('E-mail já Cadastrado!', HttpStatus.BAD_REQUEST);

    usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
    return await this.usuarioRepository.save(usuario);
  }

  async solicitarRecuperacaoSenha(email: string): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario: email },
    });

    if (!usuario) {
      return {
        message:
          'Se o email existir em nosso sistema, enviaremos instruções de recuperação.',
      };
    }

    // 1. Gerar um token/código de recuperação
    const codigoRecuperacao = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const expiracao = new Date();
    expiracao.setHours(expiracao.getHours() + 1); // Expira em 1 hora

    // 2. Salvar no banco com expiração
    usuario.tokenRecuperacao =
      await this.bcrypt.criptografarSenha(codigoRecuperacao);
    usuario.tokenExpiracao = expiracao;

    await this.usuarioRepository.save(usuario);

    // 3. Log para desenvolvimento (remova em produção)
    console.log(`=== CÓDIGO DE RECUPERAÇÃO ===`);
    console.log(`Para: ${email}`);
    console.log(`Código: ${codigoRecuperacao}`);
    console.log(`Expira: ${expiracao.toISOString()}`);
    console.log(`=============================`);

    return {
      message:
        'Se o email existir em nosso sistema, enviaremos instruções de recuperação.',
    };
  }

  async validarCodigoRecuperacao(
    email: string,
    codigo: string,
  ): Promise<{ valido: boolean }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario: email },
    });

    // Verifique se existe e se os campos não são undefined
    if (
      !usuario ||
      usuario.tokenRecuperacao === undefined ||
      usuario.tokenExpiracao === undefined
    ) {
      return { valido: false };
    }

    // Verificar se o token expirou
    if (new Date() > usuario.tokenExpiracao) {
      // Limpar token expirado - use undefined em vez de null
      usuario.tokenRecuperacao = undefined as any;
      usuario.tokenExpiracao = undefined as any;
      await this.usuarioRepository.save(usuario);
      return { valido: false };
    }

    // Verificar se o código está correto
    const codigoValido = await this.bcrypt.compararSenhas(
      codigo,
      usuario.tokenRecuperacao,
    );

    return { valido: codigoValido };
  }

  async redefinirSenha(
    email: string,
    codigo: string,
    novaSenha: string,
  ): Promise<{ message: string }> {
    const validacao = await this.validarCodigoRecuperacao(email, codigo);

    if (!validacao.valido) {
      throw new HttpException(
        'Código inválido ou expirado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const usuario = await this.findByUsuario(email);
    if (!usuario) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    // Atualizar senha
    usuario.senha = await this.bcrypt.criptografarSenha(novaSenha);

    // Limpar tokens de recuperação - use undefined
    usuario.tokenRecuperacao = undefined as any;
    usuario.tokenExpiracao = undefined as any;

    await this.usuarioRepository.save(usuario);

    return {
      message: 'Senha redefinida com sucesso!',
    };
  }

  async delete(id: number): Promise<void> {
    // Verifica se o usuário existe
    const usuario = await this.findById(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Exclui o usuário
    await this.usuarioRepository.delete(id);
  }
}
