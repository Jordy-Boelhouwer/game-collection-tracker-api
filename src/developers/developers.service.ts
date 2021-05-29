import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Developer } from './entities/developer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private developersRepository: Repository<Developer>,
  ) {}

  findAll() {
    return this.developersRepository.find();
  }

  async findOneById(id: number) {
    const developer = await this.developersRepository.findOne(id);
    if (developer) {
      return developer;
    }
    throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
  }

  async create(developer: CreateDeveloperDto) {
    const newDeveloper = await this.developersRepository.create(developer);
    await this.developersRepository.save(newDeveloper);
    return newDeveloper;
  }

  async update(id: number, developer: UpdateDeveloperDto) {
    await this.developersRepository.update(id, developer);
    const updatedDeveloper = await this.developersRepository.findOne(id);
    if (updatedDeveloper) {
      return updatedDeveloper;
    }
    throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.developersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }
  }
}
