import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: "tb_produtos" })
export class Produto {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 100, nullable: false })
    nome: string

    @ApiProperty()
    @IsNotEmpty()
    @Column({ nullable: false })
    valor: number

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 100, nullable: false })
    objetivo: string

    @ApiProperty()
    @IsNotEmpty()
    @Column({ nullable: false })
    calorias: number

    @ApiProperty({ type: () => Categoria })
    @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
        onDelete: "CASCADE"
    })
    categoria: Categoria

    @ApiProperty({ type: () => Usuario })
    @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
        onDelete: "CASCADE"
    })
    usuario: Usuario

}