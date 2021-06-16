import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Publisher } from '../entities/publisher.entity';
import { MockedPublishers } from './publisher.mock';
import { PublishersController } from '../publishers.controller';
import { PublishersService } from '../publishers.service';

describe('GenreController', () => {
  let app: INestApplication;
  let publisherData: Publisher[];
  let findPublisher: jest.Mock;
  let findAllPublishers: jest.Mock;
  let createPublisher: jest.Mock;
  let savePublisher: jest.Mock;
  let updatePublisher: jest.Mock;
  let deletePublisher: jest.Mock;

  beforeAll(async () => {
    publisherData = {
      ...MockedPublishers,
    };

    findPublisher = jest.fn().mockResolvedValue(publisherData[0]);
    findAllPublishers = jest.fn().mockResolvedValue(publisherData);
    createPublisher = jest.fn().mockResolvedValue(publisherData[0]);
    savePublisher = jest.fn().mockReturnValue(Promise.resolve());
    updatePublisher = jest
      .fn()
      .mockResolvedValue({ id: 1, name: 'Bandai Namco Games' });
    deletePublisher = jest.fn().mockResolvedValue(publisherData[0]);

    const publishersRepository = {
      findOne: findPublisher,
      find: findAllPublishers,
      create: createPublisher,
      save: savePublisher,
      update: updatePublisher,
      delete: deletePublisher,
    };

    const module = await Test.createTestingModule({
      controllers: [PublishersController],
      providers: [
        PublishersService,
        {
          provide: getRepositoryToken(Publisher),
          useValue: publishersRepository,
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

  describe('when getting all publishers', () => {
    it('should return all publishers', async () => {
      const expectedData = {
        ...publisherData,
      };

      try {
        const findAllResponse = await request(app.getHttpServer()).get(
          '/publishers',
        );
        expect(findAllResponse.status).toBe(HttpStatus.OK);
        expect(findAllResponse.body).toStrictEqual(expectedData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when getting a single publisher', () => {
    it('should return the publisher with the given id', async () => {
      try {
        const findOneResponse = await request(app.getHttpServer()).get(
          '/publishers/1',
        );
        expect(findOneResponse.status).toBe(HttpStatus.OK);
        expect(findOneResponse.body).toStrictEqual(publisherData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when creating a publisher', () => {
    it('should return the created publisher', async () => {
      try {
        const createResponse = await request(app.getHttpServer())
          .post('/publishers')
          .send({ name: 'Bandai Namco Games' });
        expect(createResponse.status).toBe(HttpStatus.CREATED);
        expect(createResponse.body).toStrictEqual(publisherData[0]);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when updating a publisher', () => {
    beforeAll(() => {
      findPublisher.mockResolvedValue({ id: 1, name: 'Bandai Namco Games' });
    });
    it('should return the updated publisher', async () => {
      try {
        const updateResponse = await request(app.getHttpServer())
          .patch('/publishers/1')
          .send({ name: 'Bandai Namco Games' });
        expect(updateResponse.status).toBe(HttpStatus.OK);
        expect(updateResponse.body).toStrictEqual({
          id: 1,
          name: 'Bandai Namco Games',
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when deleting a publisher', () => {
    beforeAll(() => {
      findPublisher.mockResolvedValue(publisherData[0]);
    });
    it('should return an 204 with an empty object', async () => {
      try {
        const deleteResponse = await request(app.getHttpServer()).delete(
          '/publishers/1',
        );
        expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
        expect(deleteResponse.body).toStrictEqual({});
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
