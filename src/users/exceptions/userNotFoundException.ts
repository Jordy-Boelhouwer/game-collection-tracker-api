import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(options?: { id?: number; email?: string }) {
    if (typeof options.id !== 'undefined') {
      super(`User with id ${options.id} does not exist`);
    } else if (typeof options.email !== 'undefined') {
      super(`User with this email does not exist`);
    } else {
      super(`User not found`);
    }
  }
}
