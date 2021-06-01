import { IsString, IsNotEmpty } from 'class-validator';
export class CreateDeveloperDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
