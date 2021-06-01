import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  id: number;
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
