import { NotFoundException } from '@nestjs/common';

export class DeveloperNotFoundException extends NotFoundException {
  constructor(developerId: number) {
    super(`Developer with id ${developerId} not found`);
  }
}
