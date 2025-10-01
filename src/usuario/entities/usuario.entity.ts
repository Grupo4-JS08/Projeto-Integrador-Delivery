/* eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength, Matches } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'boolean', default: false })
  isMasterAdmin?: boolean;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  nome: string;

  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  endereco: string;

  // CEP deve ser opcional
  @IsOptional()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP deve estar no formato 00000-000 ou 00000000' })
  @Column({ length: 10, nullable: true }) // nullable: true é IMPORTANTE
  @ApiProperty({ example: '12345-678' })
  cep?: string; // Use ? para indicar que é opcional

  @IsEmail()
  @Column({ length: 255, nullable: false })
  @ApiProperty({ example: 'email@email.com.br' })
  usuario: string;

  @Column({ length: 5000 })
  @ApiProperty()
  foto: string;

  @IsNotEmpty()
  @MinLength(8)
  @Column({ length: 255, nullable: false })
  @ApiProperty()
  senha: string;

  @IsOptional()
  @Column({ length: 5000 })
  @ApiProperty()
  objetivo: string;

  @Column({ length: 255, nullable: true })
  tokenRecuperacao?: string;

  @Column({ type: 'timestamp', nullable: true })
  tokenExpiracao?: Date;
}
