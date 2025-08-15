/* eslint-disable*/
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Produto } from '../entities/produto.entity';
import { ProdutoService } from '../services/produto.service';
import { RolesGuard } from '../../auth/guard/roles.guard';

@ApiTags('Produtos')
@UseGuards(JwtAuthGuard)
@Controller('/produtos')
@ApiBearerAuth()
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/item/:item')
  @HttpCode(HttpStatus.OK)
  findByItem(@Param('item') item: string): Promise<Produto[]> {
    return this.produtoService.findByItem(item);
  }

  @Get('recomendacao/:objetivo')
  async recomendarPorObjetivo(@Param('objetivo') objetivo: string) {
    if (!['emagrecer', 'hipertrofia', 'geral'].includes(objetivo)) {
      throw new HttpException('Objetivo inválido!',HttpStatus.NOT_FOUND);
    }
    return this.produtoService.findByObjetivo(objetivo as 'emagrecer' | 'hipertrofia' | 'geral');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.delete(id);
  }
}
