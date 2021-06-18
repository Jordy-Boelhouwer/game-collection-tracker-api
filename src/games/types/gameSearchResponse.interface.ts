import GameSearchBody from './gameSearchBody.interface';

interface GameSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: GameSearchBody;
    }>;
  };
}

export default GameSearchResult;
