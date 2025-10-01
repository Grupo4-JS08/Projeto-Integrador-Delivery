/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// automatiza as roles
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
/
  canActivate(context: ExecutionContext): boolean {
    let usuario: any;

    usuario = context.switchToHttp().getRequest().user;

    if (!usuario) {
      return true;
    }

    if (usuario.user.isMasterAdmin) {
      return true;
    }

    throw new ForbiddenException(
      'Você não tem permissão para acessar o recurso "',
    );
  }
}
