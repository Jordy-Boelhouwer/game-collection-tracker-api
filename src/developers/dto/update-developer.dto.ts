import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UpdateDeveloperDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
