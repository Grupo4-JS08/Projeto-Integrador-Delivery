/* eslint-disable*/
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Logger } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UsuarioLogin } from '../entities/usuariologin.entity';
import { LocalAuthGuard } from '../guard/local-auth.guard';

@ApiTags('Usuario')
@Controller('/usuarios') // Note: Seu endpoint está em /usuarios/logar
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/logar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBody({ type: UsuarioLogin })
  async login(@Body() user: UsuarioLogin) {
    this.logger.log(`📥 Requisição de login recebida para: ${user.usuario}`);

    try {
      const result = await this.authService.login(user);
      this.logger.log(`✅ Login controller finalizado com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(`❌ Erro no controller de login: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }
}
