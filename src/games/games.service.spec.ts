import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { Game } from '../games/entities/game.entity';
import { GameNotFoundException } from './exceptions/gameNotFound.exception';

describe('GamesService', () => {
  let gamesService: GamesService;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  let update: jest.Mock;

  beforeEach(async () => {
    find = jest.fn();
    findOne = jest.fn();
    create = jest.fn();
    save = jest.fn();
    update = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: { find, findOne, create, save, update },
        },
      ],
    }).compile();

    gamesService = module.get<GamesService>(GamesService);
  });

  describe('when getting all games', () => {
    let games: Game[];
    beforeEach(() => {
      games = [new Game()];
      find.mockReturnValue(Promise.resolve(games));
    });
    it('should return a array of games', async () => {
      const fetchedGames = await gamesService.findAll();
      expect(fetchedGames).toEqual(games);
    });
  });

  describe('when getting a game by id', () => {
    describe('and the game is found', () => {
      let game: Game;
      beforeEach(() => {
        game = new Game();
        findOne.mockResolvedValue(Promise.resolve(game));
      });

      it('should return the game', async () => {
        const fetchedGame = await gamesService.findOneById(1);
        expect(fetchedGame).toEqual(game);
      });
    });

    describe('and the game is not found', () => {
      beforeEach(() => {
        findOne.mockRejectedValue(undefined);
      });

      it('should throw a GameNotFoundException', async () => {
        expect(gamesService.findOneById(1)).rejects.toThrowError(
          GameNotFoundException,
        );
      });
    });
  });

  describe('when creating a game', () => {
    let game: Game;
    beforeEach(() => {
      game = new Game();
      create.mockReturnValue(Promise.resolve(game));
      save.mockResolvedValue(Promise.resolve(game));
    });
    it('should return the created game', async () => {
      const createdGame = await gamesService.create(game);
      expect(createdGame).toEqual(game);
    });
  });

  describe('when updating a game', () => {
    describe('and the game is found with the provided id', () => {
      let game: Game;
      beforeEach(() => {
        game = new Game();
        update.mockResolvedValue(Promise.resolve(game));
        findOne.mockResolvedValue(Promise.resolve(game));
      });
      it('should return the updated game', async () => {
        const updatedGame = await gamesService.update(1, game);
        expect(updatedGame).toEqual(game);
      });
    });

    describe('and the game is not found with the provided id', () => {
      beforeEach(() => {
        findOne.mockResolvedValue(undefined);
      });
      it('should throw a GameNotFoundException', async () => {
        expect(gamesService.update).rejects.toThrowError(GameNotFoundException);
      });
    });
  });
});
