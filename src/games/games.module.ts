import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { SearchModule } from '../search/search.module';
import GamesSearchService from './gameSearch.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), SearchModule],
  controllers: [GamesController],
  providers: [GamesService, GamesSearchService],
})
export class GamesModule {}
