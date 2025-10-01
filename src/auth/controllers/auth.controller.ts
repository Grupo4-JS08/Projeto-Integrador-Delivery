/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Request,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Usuario')
@Controller('/usuarios')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logar')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }
}
