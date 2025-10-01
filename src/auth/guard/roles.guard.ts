/* eslint-disable */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtém o usuário da request
    const usuario = context.switchToHttp().getRequest().user;

    // Se não há usuário (não autenticado), permite passar para outros guards
    if (!usuario) {
      return true;
    }

    // Se é master admin, permite acesso
    if (usuario.isMasterAdmin) {
      return true;
    }

    // Se não é master admin, lança exceção
    throw new ForbiddenException(
      'Você não tem permissão para acessar este recurso',
    );
  }
}
