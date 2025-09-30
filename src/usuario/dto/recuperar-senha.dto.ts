import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecuperarSenhaDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Email do usuário para recuperação de senha',
  })
  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}
