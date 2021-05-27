import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './genre.interface';

@Injectable()
export class GenresService {
  private lastGenreId = 0;
  private genres: Genre[] = [];

  findAll() {
    return this.genres;
  }

  findOne(id: number) {
    const genre = this.genres.find((genre) => genre.id === id);
    if (genre) {
      return genre;
    }
    throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
  }

  create(genre: CreateGenreDto) {
    const newGenre = {
      id: ++this.lastGenreId,
      ...genre,
    };
    this.genres.push(newGenre);
    return newGenre;
  }

  update(id: number, genre: UpdateGenreDto) {
    const genreIndex = this.genres.findIndex((genre) => genre.id === id);
    if (genreIndex > -1) {
      this.genres[genreIndex] = genre;
      return genre;
    }
    throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const genreIndex = this.genres.findIndex((genre) => genre.id === id);
    if (genreIndex > -1) {
      this.genres.splice(genreIndex, 1);
    } else {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
  }
}
