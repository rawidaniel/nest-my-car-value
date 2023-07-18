import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'test@gmail.com',
    description: 'email used to create a new user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '12345',
    description: 'credential to secure creating new user',
  })
  @IsString()
  password: string;
}
