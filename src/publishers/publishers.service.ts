import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './publisher.interface';

@Injectable()
export class PublishersService {
  private lastPublisherId = 0;
  private publishers: Publisher[] = [];

  findAll() {
    return this.publishers;
  }

  findOne(id: number) {
    const publisher = this.publishers.find((publisher) => publisher.id === id);
    if (publisher) {
      return publisher;
    }
    throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
  }

  create(publisher: CreatePublisherDto) {
    const newPublisher = {
      id: ++this.lastPublisherId,
      ...publisher,
    };
    this.publishers.push(newPublisher);
    return newPublisher;
  }

  update(id: number, publisher: UpdatePublisherDto) {
    const publisherIndex = this.publishers.findIndex(
      (publisher) => publisher.id === id,
    );
    if (publisherIndex > -1) {
      this.publishers[publisherIndex] = publisher;
      return publisher;
    }
    throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const publisherIndex = this.publishers.findIndex(
      (publisher) => publisher.id === id,
    );
    if (publisherIndex > -1) {
      this.publishers.splice(publisherIndex, 1);
    } else {
      throw new HttpException('Publisher not found', HttpStatus.NOT_FOUND);
    }
  }
}
