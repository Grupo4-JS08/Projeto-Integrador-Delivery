import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Produto } from "../../produto/entities/produto.entity"

@Entity({ name: "tb_usuarios" })
export class Usuario {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    @ApiProperty()
    nome: string

    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    @ApiProperty()
    endereco: string

    @IsEmail()
    @Column({ length: 255, nullable: false })
    @ApiProperty({ example: "email@email.com.br" })
    usuario: string

    @Column({ length: 5000 })
    @ApiProperty()
    foto: string;

    @IsNotEmpty()
    @MinLength(8)
    @Column({ length: 255, nullable: false })
    @ApiProperty()
    senha: string

    @IsOptional()
    @Column({ length: 5000 })
    @ApiProperty()
    objetivo: string

    @IsOptional()
    @ApiProperty()
    @OneToMany(() => Produto, (produto) => produto.usuario)
    produto: Produto[]

}
