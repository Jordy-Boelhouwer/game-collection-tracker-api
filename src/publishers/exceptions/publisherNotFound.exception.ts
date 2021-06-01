import { NotFoundException } from '@nestjs/common';

export class PublisherNotFoundException extends NotFoundException {
  constructor(publisherId: number) {
    super(`Publisher with id ${publisherId} not found`);
  }
}
