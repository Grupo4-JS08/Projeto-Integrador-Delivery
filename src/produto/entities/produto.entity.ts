/* eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity({ name: 'tb_produtos' })
export class Produto {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  item: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  valor: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  calorias: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['emagrecer', 'hipertrofia', 'geral'])
  @Column({ default: 'geral' })
  objetivo: 'emagrecer' | 'hipertrofia' | 'geral'; // Tipos possíveis

  @ApiProperty({ type: () => Categoria })
  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    onDelete: 'CASCADE',
  })
  categoria: Categoria;
}
