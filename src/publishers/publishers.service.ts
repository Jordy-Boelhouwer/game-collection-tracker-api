import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private publishersRepository: Repository<Publisher>,
  ) {}

  findAll() {
    return this.publishersRepository.find();
  }

  async findOneById(id: number) {
    const publisher = await this.publishersRepository.findOne(id);
    if (publisher) {
      return publisher;
    }
    throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
  }

  async create(publisher: CreatePublisherDto) {
    const newPublisher = this.publishersRepository.create(publisher);
    await this.publishersRepository.save(newPublisher);
    return newPublisher;
  }

  async update(id: number, publisher: UpdatePublisherDto) {
    await this.publishersRepository.update(id, publisher);
    const updatedPublisher = await this.publishersRepository.findOne(id);
    if (updatedPublisher) {
      return updatedPublisher;
    }
    throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.publishersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
    }
  }
}
