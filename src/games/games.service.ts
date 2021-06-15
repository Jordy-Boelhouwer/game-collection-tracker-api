import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GameNotFoundException } from './exceptions/gameNotFound.exception';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  findAll() {
    return this.gamesRepository.find();
  }

  async findOneById(id: number) {
    const game = await this.gamesRepository.findOne(id);
    if (game) {
      return game;
    }
    throw new GameNotFoundException(id);
  }

  async create(game: CreateGameDto) {
    const newGame = this.gamesRepository.create(game);
    await this.gamesRepository.save(newGame);
    return newGame;
  }

  async update(id: number, game: UpdateGameDto) {
    await this.gamesRepository.update(id, game);
    const updatedGame = await this.gamesRepository.findOne(id);
    if (updatedGame) {
      return updatedGame;
    }
    throw new GameNotFoundException(id);
  }

  async remove(id: number) {
    const game = await this.gamesRepository.findOne(id);
    if (!game) {
      throw new GameNotFoundException(id);
    }
    const deleteResponse = await this.gamesRepository.delete(id);
    return {};
  }
}
