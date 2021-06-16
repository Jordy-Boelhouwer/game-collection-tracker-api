import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Platform } from '../entities/platform.entity';
import { MockedPlatforms } from './platform.mock';
import { PlatformsController } from '../platforms.controller';
import { PlatformsService } from '../platforms.service';

describe('GenreController', () => {
  let app: INestApplication;
  let platformData: Platform[];
  let findPlatform: jest.Mock;
  let findAllPlatforms: jest.Mock;
  let createPlatform: jest.Mock;
  let savePlatform: jest.Mock;
  let updatePlatform: jest.Mock;
  let deletePlatform: jest.Mock;

  beforeAll(async () => {
    platformData = {
      ...MockedPlatforms,
    };

    findPlatform = jest.fn().mockResolvedValue(platformData[0]);
    findAllPlatforms = jest.fn().mockResolvedValue(platformData);
    createPlatform = jest.fn().mockResolvedValue(platformData[0]);
    savePlatform = jest.fn().mockReturnValue(Promise.resolve());
    updatePlatform = jest.fn().mockResolvedValue({ id: 1, name: 'PS2' });
    deletePlatform = jest.fn().mockResolvedValue(platformData[0]);

    const platformsRepository = {
      findOne: findPlatform,
      find: findAllPlatforms,
      create: createPlatform,
      save: savePlatform,
      update: updatePlatform,
      delete: deletePlatform,
    };

    const module = await Test.createTestingModule({
      controllers: [PlatformsController],
      providers: [
        PlatformsService,
        {
          provide: getRepositoryToken(Platform),
          useValue: platformsRepository,
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

  describe('when getting all platforms', () => {
    it('should return all platforms', async () => {
      const expectedData = {
        ...platformData,
      };

      try {
        const findAllResponse = await request(app.getHttpServer()).get(
          '/platforms',
        );
        expect(findAllResponse.status).toBe(HttpStatus.OK);
        expect(findAllResponse.body).toStrictEqual(expectedData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when getting a single platform', () => {
    it('should return the platform with the given id', async () => {
      try {
        const findOneResponse = await request(app.getHttpServer()).get(
          '/platforms/1',
        );
        expect(findOneResponse.status).toBe(HttpStatus.OK);
        expect(findOneResponse.body).toStrictEqual(platformData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when creating a platform', () => {
    it('should return the created platform', async () => {
      try {
        const createResponse = await request(app.getHttpServer())
          .post('/platforms')
          .send({ name: 'PS2' });
        expect(createResponse.status).toBe(HttpStatus.CREATED);
        expect(createResponse.body).toStrictEqual(platformData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when updating a platform', () => {
    beforeAll(() => {
      findPlatform.mockResolvedValue({ id: 1, name: 'PS2' });
    });
    it('should return the updated platform', async () => {
      try {
        const updateResponse = await request(app.getHttpServer())
          .patch('/platforms/1')
          .send({ name: 'PS2' });
        expect(updateResponse.status).toBe(HttpStatus.OK);
        expect(updateResponse.body).toStrictEqual({
          id: 1,
          name: 'PS2',
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when deleting a platform', () => {
    beforeAll(() => {
      findPlatform.mockResolvedValue(platformData[0]);
    });
    it('should return an 204 with an empty object', async () => {
      try {
        const deleteResponse = await request(app.getHttpServer()).delete(
          '/platforms/1',
        );
        expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
        expect(deleteResponse.body).toStrictEqual({});
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
