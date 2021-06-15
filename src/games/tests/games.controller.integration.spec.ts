import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { Game } from '../entities/game.entity';
import { MockedGames } from './games.mock';
import { GamesController } from '../games.controller';
import { GamesService } from '../games.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import { JwtService } from '@nestjs/jwt';
import { MockedJwtService } from '../../utils/mocks/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DeveloperController', () => {
  let app: INestApplication;
  let gameData: Game[];
  let findGame: jest.Mock;
  let findAllGamesDevelopers: jest.Mock;
  let createGame: jest.Mock;
  let saveGame: jest.Mock;
  let updateGame: jest.Mock;
  let deleteGame: jest.Mock;

  beforeAll(async () => {
    gameData = {
      ...MockedGames,
    };

    findGame = jest.fn().mockResolvedValue(gameData[0]);
    findAllGamesDevelopers = jest.fn().mockResolvedValue(gameData);
    createGame = jest.fn().mockResolvedValue(plainToClass(Game, gameData[0]));
    saveGame = jest.fn().mockReturnValue(Promise.resolve());
    updateGame = jest
      .fn()
      .mockResolvedValue({ id: 1, name: 'Sonic Adventure' });
    deleteGame = jest.fn().mockResolvedValue(gameData[0]);

    const gamesRepository = {
      findOne: findGame,
      find: findAllGamesDevelopers,
      create: createGame,
      save: saveGame,
      update: updateGame,
      delete: deleteGame,
    };

    const module = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: gamesRepository,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('when getting all games', () => {
    it('should return all games', async () => {
      const expectedData = {
        ...gameData,
      };

      try {
        const findAllResponse = await request(app.getHttpServer()).get(
          '/games',
        );
        expect(findAllResponse.status).toBe(HttpStatus.OK);
        expect(findAllResponse.body).toStrictEqual(expectedData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when getting a single game', () => {
    it('should return the game with the given id', async () => {
      try {
        const findOneResponse = await request(app.getHttpServer()).get(
          '/games/1',
        );
        expect(findOneResponse.status).toBe(HttpStatus.OK);
        expect(findOneResponse.body).toStrictEqual(gameData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when creating a game', () => {
    it('should return the created game', async () => {
      try {
        const createResponse = await request(app.getHttpServer())
          .post('/games')
          .send({ title: 'Crash Bandicoot' });
        expect(createResponse.status).toBe(HttpStatus.CREATED);
        expect(createResponse.body).toStrictEqual(gameData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when updating a game', () => {
    beforeAll(() => {
      findGame.mockResolvedValue({ id: 1, name: 'Sonic adventure' });
    });
    it('should return the updated game', async () => {
      try {
        const updateResponse = await request(app.getHttpServer())
          .patch('/games/1')
          .send({ name: 'Sonic adventure' });
        expect(updateResponse.status).toBe(HttpStatus.OK);
        expect(updateResponse.body).toStrictEqual({
          id: 1,
          name: 'Sonic adventure',
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when deleting a game', () => {
    beforeAll(() => {
      findGame.mockResolvedValue(gameData[0]);
    });
    it('should return an 204 with an empty object', async () => {
      try {
        const deleteResponse = await request(app.getHttpServer()).delete(
          '/games/1',
        );
        expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
        expect(deleteResponse.body).toStrictEqual({});
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
