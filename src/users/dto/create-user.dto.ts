import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
