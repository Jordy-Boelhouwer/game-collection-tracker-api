import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';
export class UpdateGameDto {
  @IsNumber()
  @IsOptional()
  id: number;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  coverArt: string;
  @IsString()
  @IsOptional()
  priceLoose: string;
  @IsString()
  @IsOptional()
  priceCIB: string;
  @IsString()
  @IsOptional()
  priceNew: string;
  @IsDate()
  @IsOptional()
  release: Date;
}
