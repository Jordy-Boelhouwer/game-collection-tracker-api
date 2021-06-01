import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
export class UpdatePublisherDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
