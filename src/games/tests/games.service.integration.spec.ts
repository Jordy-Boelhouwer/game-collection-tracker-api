import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { GamesService } from '../games.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import { MockedGames } from './games.mock';
import { GameNotFoundException } from '../exceptions/gameNotFound.exception';

describe('GamesService', () => {
  let gamesService: GamesService;
  let gamesData: Game[];
  let findAllGames: jest.Mock;
  let findGame: jest.Mock;
  let createGame: jest.Mock;
  let saveGame: jest.Mock;
  let updateGame: jest.Mock;

  beforeEach(async () => {
    gamesData = {
      ...MockedGames,
    };

    findAllGames = jest.fn().mockResolvedValue(gamesData);
    findGame = jest.fn().mockResolvedValue(gamesData[0]);
    createGame = jest.fn().mockReturnValue(gamesData[0]);
    saveGame = jest.fn().mockResolvedValue(gamesData[0]);
    updateGame = jest.fn().mockResolvedValue(gamesData[0]);

    const gamesRepository = {
      find: findAllGames,
      findOne: findGame,
      create: createGame,
      save: saveGame,
      update: updateGame,
    };

    const module = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: ConfigService,
          useValue: MockedConfigService,
        },
        {
          provide: getRepositoryToken(Game),
          useValue: gamesRepository,
        },
      ],
    }).compile();
    gamesService = module.get<GamesService>(GamesService);
  });

  describe('when accessing the data of all games', () => {
    it('should return all game data', async () => {
      const games = await gamesService.findAll();
      expect(games).toBe(gamesData);
    });
  });

  describe('when accessing the data of a single game', () => {
    describe('and the provided id is not valid', () => {
      beforeEach(() => {
        findGame.mockResolvedValue(undefined);
      });
      it('should throw an GameNotFoundException', async () => {
        expect(gamesService.findOneById).rejects.toThrowError(
          GameNotFoundException,
        );
      });
    });

    describe('and the provided id is valid', () => {
      it('should return the game', async () => {
        const game = await gamesService.findOneById(1);
        expect(game).toEqual(gamesData[0]);
      });
    });
  });

  describe('when creating a game', () => {
    it('should return the created game', async () => {
      const game = await gamesService.create(gamesData[0]);
      expect(game).toEqual(gamesData[0]);
    });
  });

  describe('when updating a game', () => {
    describe('and the game is not found', () => {
      beforeEach(() => {
        findGame.mockResolvedValue(undefined);
      });
      it('should throw a GameNotFoundException', async () => {
        expect(gamesService.update(1, gamesData[0])).rejects.toThrowError(
          GameNotFoundException,
        );
      });
    });

    describe('and the game is found', () => {
      it('should return the updated game', async () => {
        const game = await gamesService.update(gamesData[0].id, gamesData[0]);
        expect(game).toEqual(gamesData[0]);
      });
    });
  });

  describe('when removing a game', () => {
    describe('and the game is not found', () => {
      beforeEach(() => {
        findGame.mockResolvedValue(undefined);
      });
      it('should throw a GameNotFoundException', async () => {
        expect(gamesService.remove(1)).rejects.toThrowError(
          GameNotFoundException,
        );
      });
    });

    describe('and the game is found', () => {
      it('should return an empty object', async () => {
        expect(gamesService.remove(1)).resolves.toEqual({});
      });
    });
  });
});
