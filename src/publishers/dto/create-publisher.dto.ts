import { IsString, IsNotEmpty } from 'class-validator';
export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
