/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Produto } from '../../produto/entities/produto.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Injectable()
export class DevService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '513610',
      database: 'db_delivery',
      entities: [Produto, Categoria, Usuario],
      synchronize: true,
    };
  }
}
