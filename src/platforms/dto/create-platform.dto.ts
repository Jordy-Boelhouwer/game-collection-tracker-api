import { IsString, IsNotEmpty } from 'class-validator';
export class CreatePlatformDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
