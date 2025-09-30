/* eslint-disable */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioService } from '../services/usuario.service';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { RecuperarSenhaDto } from '../dto/recuperar-senha.dto';

@ApiTags('Usuario')
@Controller('/usuarios')
@ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuarioService.findById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/cadastrar')
  async create(@Body() usuario: Usuario): Promise<Usuario> {
    return await this.usuarioService.create(usuario);
  }

  @Put('/atualizar')
  @HttpCode(HttpStatus.OK)
  async update(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuarioService.update(usuario);
  }

  @Post('/recuperar-senha')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({
    status: 200,
    description: 'Solicitação de recuperação processada com sucesso'
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos'
  })
  async recuperarSenha(@Body() recuperarSenhaDto: RecuperarSenhaDto) {
    return await this.usuarioService.solicitarRecuperacaoSenha(
      recuperarSenhaDto.email
    );
  }

    @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir usuário por ID' })
  @ApiResponse({
    status: 204,
    description: 'Usuário excluído com sucesso'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado'
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuarioService.delete(id);
  }
}
