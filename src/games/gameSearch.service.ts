import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Game } from './entities/game.entity';
import GameSearchResult from './types/gameSearchResponse.interface';
import GameSearchBody from './types/gameSearchBody.interface';

@Injectable()
export default class GamesSearchService {
  index = 'games';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexGame(game: Game) {
    return this.elasticsearchService.index<GameSearchResult, GameSearchBody>({
      index: this.index,
      body: {
        id: game.id,
        title: game.title,
      },
    });
  }

  async search(text: string) {
    const { body } = await this.elasticsearchService.search<GameSearchResult>({
      index: this.index,
      body: {
        query: {
          match: {
            query: text,
            fields: ['title'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}
