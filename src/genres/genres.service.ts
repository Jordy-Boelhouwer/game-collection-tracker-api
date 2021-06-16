import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { GenreNotFoundException } from './exceptions/genreNotFound.exception';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
  ) {}

  findAll() {
    return this.genresRepository.find();
  }

  async findOneById(id: number) {
    const genre = await this.genresRepository.findOne(id);
    if (genre) {
      return genre;
    }
    throw new GenreNotFoundException(id);
  }

  async create(genre: CreateGenreDto) {
    const newGenre = this.genresRepository.create(genre);
    await this.genresRepository.save(newGenre);
    return newGenre;
  }

  async update(id: number, genre: UpdateGenreDto) {
    await this.genresRepository.update(id, genre);
    const updatedGenre = await this.genresRepository.findOne(id);
    if (updatedGenre) {
      return updatedGenre;
    }
    throw new GenreNotFoundException(id);
  }

  async remove(id: number) {
    const genre = await this.genresRepository.findOne(id);
    if (!genre) {
      throw new GenreNotFoundException(id);
    }
    const deleteResponse = await this.genresRepository.delete(id);
    return {};
  }
}
