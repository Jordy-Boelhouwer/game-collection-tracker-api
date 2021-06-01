import { NotFoundException } from '@nestjs/common';

export class PlatformNotFoundException extends NotFoundException {
  constructor(platformId: number) {
    super(`Platform with id ${platformId} not found`);
  }
}
