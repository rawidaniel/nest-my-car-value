import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'email used to create a new user',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '12345',
    description: 'credential to secure creating new user',
  })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    example: true,
    default: false,
    description: 'show the role of the user',
  })
  @IsBoolean()
  @IsOptional()
  admin: boolean;
}
