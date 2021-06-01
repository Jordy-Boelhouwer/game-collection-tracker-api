import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
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
