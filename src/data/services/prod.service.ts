/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: 'postgresql://db_delivery_devlivery_user:e9o6ajlX857mvgvBMy2iwe2cyOUcNDae@dpg-d34q5tgdl3ps73842sjg-a.oregon-postgres.render.com/db_delivery_devlivery',
      logging: true,
      dropSchema: false,
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: false, // ← MUDE PARA FALSE AQUI!
      autoLoadEntities: true,
      extra: {
        connectionLimit: 10,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    };
  }
}
