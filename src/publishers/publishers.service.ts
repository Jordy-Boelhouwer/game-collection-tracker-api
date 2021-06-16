import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { PublisherNotFoundException } from './exceptions/publisherNotFound.exception';

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
    throw new PublisherNotFoundException(id);
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
    throw new PublisherNotFoundException(id);
  }

  async remove(id: number) {
    const publisher = await this.publishersRepository.findOne(id);
    if (!publisher) {
      throw new PublisherNotFoundException(id);
    }
    await this.publishersRepository.delete(id);
    return {};
  }
}
