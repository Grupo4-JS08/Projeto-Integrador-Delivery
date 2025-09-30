/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      // Use a URL completa com o hostname correto
      url: 'postgresql://db_delivery_devlivery_user:e9o6ajlX857mvgvBMy2iwe2cyOUcNDae@dpg-d34q5tgdl3ps73842sjg-a.oregon-postgres.render.com/db_delivery_devlivery',
      logging: true, // Ative para ver logs de conexão
      dropSchema: false,
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
      autoLoadEntities: true,
      // Adicione configurações extras de conexão
      extra: {
        connectionLimit: 10,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    };
  }
}
