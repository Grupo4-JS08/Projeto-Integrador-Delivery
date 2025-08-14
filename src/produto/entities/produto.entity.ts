/* eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

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
  @Column({ nullable: false })
  valor: number;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ nullable: false })
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

  // @ApiProperty({ type: () => Usuario })
  // @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
  //   onDelete: 'CASCADE',
  // })
  // usuario: Usuario;
}
