import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import Developer from './developer.interface';

@Injectable()
export class DevelopersService {
  private lastDeveloperId = 0;
  private developers: Developer[] = [];

  findAll() {
    return this.developers;
  }

  findOne(id: number) {
    const developer = this.developers.find((developer) => developer.id === id);
    if (developer) {
      return developer;
    }
    throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
  }

  create(developer: CreateDeveloperDto) {
    const newDeveloper = {
      id: ++this.lastDeveloperId,
      ...developer,
    };
    this.developers.push(newDeveloper);
    return newDeveloper;
  }

  update(id: number, developer: UpdateDeveloperDto) {
    const developerIndex = this.developers.findIndex(
      (developer) => developer.id === id,
    );
    if (developerIndex > -1) {
      this.developers[developerIndex] = developer;
      return developer;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const developerIndex = this.developers.findIndex(
      (developer) => developer.id === id,
    );
    if (developerIndex > -1) {
      this.developers.splice(developerIndex, 1);
    } else {
      throw new HttpException('Developer not found', HttpStatus.NOT_FOUND);
    }
  }
}
