import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',
      port: 3306,
      username: 'root',
      password: '250319',
      database: 'db_delivery',
      entities: [],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}



