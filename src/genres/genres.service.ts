import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

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
    throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
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
    throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.genresRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
  }
}
