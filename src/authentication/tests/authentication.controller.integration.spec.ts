import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AuthenticationService } from '../authentication.service';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { MockedJwtService } from '../../utils/mocks/jwt.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import { AuthenticationController } from '../authentication.controller';
import mockedUser from './user.mock';
import { plainToClass } from 'class-transformer';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';

describe('AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;
  let bcryptCompare: jest.Mock;

  beforeAll(async () => {
    userData = {
      ...mockedUser,
    };

    const usersRepository = {
      findOne: jest.fn().mockResolvedValue(userData),
      create: jest.fn().mockResolvedValue(plainToClass(User, userData)),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        LocalStrategy,
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: MockedConfigService,
        },
        {
          provide: JwtService,
          useValue: MockedJwtService,
        },
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

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user', async () => {
        const expectedData = {
          ...userData,
        };

        delete expectedData.password;

        try {
          const response = await request(app.getHttpServer())
            .post('/authentication/register')
            .send({
              email: mockedUser.email,
              password: 'strongPassword',
            });

          expect(response.status).toBe(HttpStatus.CREATED);
          expect(response.body).toStrictEqual(expectedData);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error', async () => {
        try {
          const response = await request(app.getHttpServer())
            .post('/authentication/register')
            .send({
              email: mockedUser.email,
            });
          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
  });

  describe('when logging in', () => {
    it('should authenticate the user', async () => {
      try {
        const response = await request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            email: mockedUser.email,
            password: mockedUser.password,
          });
        expect(response.headers['set-cookie']).toEqual([
          'Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTYyMzA2MTk4OSwiZXhwIjoxNjIzMDY1NTg5fQ.YsfUpWVEQAdFCyuRVoE0KT5ilDCeu-GGB6NmBnRHzew; HttpOnly; Path=/; Max-Age=3600',
        ]);
        expect(response.status).toBe(HttpStatus.OK);
      } catch (error) {
        throw error;
      }
    });

    it('should throw an 401 error when invalid data is given', async () => {
      try {
        const response = await request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            email: mockedUser.email,
          });
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      } catch (error) {
        throw error;
      }
    });
  });
});
