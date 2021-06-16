import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Developer } from '../entities/developer.entity';
import { MockedDevelopers } from './developer.mock';
import { DevelopersController } from '../developers.controller';
import { DevelopersService } from '../developers.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DeveloperController', () => {
  let app: INestApplication;
  let developerData: Developer[];
  let findDeveloper: jest.Mock;
  let findAllDevelopers: jest.Mock;
  let createDeveloper: jest.Mock;
  let saveDeveloper: jest.Mock;
  let updateDeveloper: jest.Mock;
  let deleteDeveloper: jest.Mock;

  beforeAll(async () => {
    developerData = {
      ...MockedDevelopers,
    };

    findDeveloper = jest.fn().mockResolvedValue(developerData[0]);
    findAllDevelopers = jest.fn().mockResolvedValue(developerData);
    createDeveloper = jest.fn().mockResolvedValue(developerData[0]);
    saveDeveloper = jest.fn().mockReturnValue(Promise.resolve());
    updateDeveloper = jest
      .fn()
      .mockResolvedValue({ id: 1, name: 'Sonic Team' });
    deleteDeveloper = jest.fn().mockResolvedValue(developerData[0]);

    const developersRepository = {
      findOne: findDeveloper,
      find: findAllDevelopers,
      create: createDeveloper,
      save: saveDeveloper,
      update: updateDeveloper,
      delete: deleteDeveloper,
    };

    const module = await Test.createTestingModule({
      controllers: [DevelopersController],
      providers: [
        DevelopersService,
        {
          provide: getRepositoryToken(Developer),
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

  describe('when getting all developers', () => {
    it('should return all developers', async () => {
      const expectedData = {
        ...developerData,
      };

      try {
        const findAllResponse = await request(app.getHttpServer()).get(
          '/developers',
        );
        expect(findAllResponse.status).toBe(HttpStatus.OK);
        expect(findAllResponse.body).toStrictEqual(expectedData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when getting a single developer', () => {
    it('should return the developer with the given id', async () => {
      try {
        const findOneResponse = await request(app.getHttpServer()).get(
          '/developers/1',
        );
        expect(findOneResponse.status).toBe(HttpStatus.OK);
        expect(findOneResponse.body).toStrictEqual(developerData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when creating a developer', () => {
    it('should return the created developer', async () => {
      try {
        const createResponse = await request(app.getHttpServer())
          .post('/developers')
          .send({ name: 'Cing' });
        expect(createResponse.status).toBe(HttpStatus.CREATED);
        expect(createResponse.body).toStrictEqual(developerData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when updating a developer', () => {
    beforeAll(() => {
      findDeveloper.mockResolvedValue({ id: 1, name: 'Sonic Team' });
    });
    it('should return the updated developer', async () => {
      try {
        const updateResponse = await request(app.getHttpServer())
          .patch('/developers/1')
          .send({ name: 'Sonic Team' });
        expect(updateResponse.status).toBe(HttpStatus.OK);
        expect(updateResponse.body).toStrictEqual({
          id: 1,
          name: 'Sonic Team',
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when deleting a developer', () => {
    beforeAll(() => {
      findDeveloper.mockResolvedValue(developerData[0]);
    });
    it('should return an 204 with an empty object', async () => {
      try {
        const deleteResponse = await request(app.getHttpServer()).delete(
          '/developers/1',
        );
        expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
        expect(deleteResponse.body).toStrictEqual({});
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
