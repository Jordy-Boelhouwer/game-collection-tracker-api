import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import MockedUsers from '../../authentication/tests/user.mock';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UserController', () => {
  let app: INestApplication;
  let userData: User;
  let findUser: jest.Mock;
  let createUser: jest.Mock;
  let saveUser: jest.Mock;
  let updateUser: jest.Mock;
  let deleteUser: jest.Mock;

  beforeAll(async () => {
    userData = {
      ...MockedUsers,
    };

    findUser = jest.fn().mockResolvedValue(userData);
    createUser = jest.fn().mockResolvedValue(plainToClass(User, userData));
    saveUser = jest.fn().mockReturnValue(Promise.resolve());
    updateUser = jest.fn().mockResolvedValue(userData);
    deleteUser = jest.fn().mockResolvedValue({});

    const usersRepository = {
      findOne: findUser,
      create: createUser,
      save: saveUser,
      update: updateUser,
      delete: deleteUser,
    };

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
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

  describe('when getting a single user', () => {
    it('should return the user with the given id', async () => {
      try {
        const findOneResponse = await request(app.getHttpServer()).get(
          '/users/1',
        );
        expect(findOneResponse.status).toBe(HttpStatus.OK);
        expect(findOneResponse.body).toStrictEqual(userData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when creating a user', () => {
    it('should return the created user', async () => {
      const expectedData = {
        ...userData,
      };

      delete expectedData.password;
      try {
        const createResponse = await request(app.getHttpServer())
          .post('/users')
          .send({ email: 'user@email.com', password: 'hash12345' });
        expect(createResponse.status).toBe(HttpStatus.CREATED);
        expect(createResponse.body).toStrictEqual(expectedData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when updating a user', () => {
    beforeAll(() => {
      findUser.mockResolvedValue(userData);
    });
    it('should return the updated user', async () => {
      try {
        const updateResponse = await request(app.getHttpServer())
          .patch('/users/1')
          .send(userData);
        expect(updateResponse.status).toBe(HttpStatus.OK);
        expect(updateResponse.body).toStrictEqual(userData);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('when deleting a user', () => {
    beforeAll(() => {
      findUser.mockResolvedValue(userData);
    });
    it('should return an 204 with an empty object', async () => {
      try {
        const deleteResponse = await request(app.getHttpServer()).delete(
          '/users/1',
        );
        expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
        expect(deleteResponse.body).toStrictEqual({});
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});
