import { NotFoundException } from '@nestjs/common';

export class GenreNotFoundException extends NotFoundException {
  constructor(genreId: number) {
    super(`Genre with id ${genreId} not found`);
  }
}
