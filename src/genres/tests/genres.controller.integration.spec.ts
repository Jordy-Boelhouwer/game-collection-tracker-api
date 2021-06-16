import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from '../entities/genre.entity';
import { MockedGenres } from './genre.mock';
import { GenresController } from '../genres.controller';
import { GenresService } from '../genres.service';

describe('GenreController', () => {
  let app: INestApplication;
  let genreData: Genre[];
  let findGenre: jest.Mock;
  let findAllGenres: jest.Mock;
  let createGenre: jest.Mock;
  let saveGenre: jest.Mock;
  let updateGenre: jest.Mock;
  let deleteGenre: jest.Mock;

  beforeAll(async () => {
    genreData = {
      ...MockedGenres,
    };

    findGenre = jest.fn().mockResolvedValue(genreData[0]);
    findAllGenres = jest.fn().mockResolvedValue(genreData);
    createGenre = jest.fn().mockResolvedValue(genreData[0]);
    saveGenre = jest.fn().mockReturnValue(Promise.resolve());
    updateGenre = jest.fn().mockResolvedValue({ id: 1, name: 'RPG' });
    deleteGenre = jest.fn().mockResolvedValue(genreData[0]);

    const developersRepository = {
      findOne: findGenre,
      find: findAllGenres,
      create: createGenre,
      save: saveGenre,
      update: updateGenre,
      delete: deleteGenre,
    };

    const module = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: developersRepository,
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

  describe('when getting all genres', () => {
    it('should return all genres', async () => {
      const expectedData = {
        ...genreData,
      };

      try {
        const findAllResponse = await request(app.getHttpServer()).get(
          '/genres',
        );
        expect(findAllResponse.status).toBe(HttpStatus.OK);
        expect(findAllResponse.body).toStrictEqual(expectedData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when getting a single genre', () => {
    it('should return the genre with the given id', async () => {
      try {
        const findOneResponse = await request(app.getHttpServer()).get(
          '/genres/1',
        );
        expect(findOneResponse.status).toBe(HttpStatus.OK);
        expect(findOneResponse.body).toStrictEqual(genreData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when creating a genre', () => {
    it('should return the created genre', async () => {
      try {
        const createResponse = await request(app.getHttpServer())
          .post('/genres')
          .send({ name: 'Cing' });
        expect(createResponse.status).toBe(HttpStatus.CREATED);
        expect(createResponse.body).toStrictEqual(genreData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when updating a genre', () => {
    beforeAll(() => {
      findGenre.mockResolvedValue({ id: 1, name: 'RPG' });
    });
    it('should return the updated genre', async () => {
      try {
        const updateResponse = await request(app.getHttpServer())
          .patch('/genres/1')
          .send({ name: 'RPG' });
        expect(updateResponse.status).toBe(HttpStatus.OK);
        expect(updateResponse.body).toStrictEqual({
          id: 1,
          name: 'RPG',
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when deleting a genre', () => {
    beforeAll(() => {
      findGenre.mockResolvedValue(genreData[0]);
    });
    it('should return an 204 with an empty object', async () => {
      try {
        const deleteResponse = await request(app.getHttpServer()).delete(
          '/genres/1',
        );
        expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
        expect(deleteResponse.body).toStrictEqual({});
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
