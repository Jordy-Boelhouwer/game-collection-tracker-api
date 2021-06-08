import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';
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
import * as superagent from 'superagent';
import * as cookieParser from 'cookie-parser';

describe('AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
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
    app.use(cookieParser());
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user', () => {
        const expectedData = {
          ...userData,
        };

        delete expectedData.password;

        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: mockedUser.email,
            password: 'strongPassword',
          })
          .expect(201)
          .expect(expectedData);
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: mockedUser.email,
          })
          .expect(400);
      });
    });
  });

  describe('when logging in', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user', () => {
        const expectedData = {
          ...userData,
        };

        return request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            email: mockedUser.email,
            password: mockedUser.password,
          })
          .expect(200)
          .expect(expectedData);
      });

      it('should save the jwt in a cookie', () => {
        return request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            email: mockedUser.email,
            password: mockedUser.password,
          })
          .expect(
            'set-cookie',
            'Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTYyMzA2MTk4OSwiZXhwIjoxNjIzMDY1NTg5fQ.YsfUpWVEQAdFCyuRVoE0KT5ilDCeu-GGB6NmBnRHzew; HttpOnly; Path=/; Max-Age=3600',
          );
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/authentication/login')
          .send({
            email: mockedUser.email,
          })
          .expect(401);
      });
    });

    // describe('and when logging out', () => {
    //   it('should remove the jwt from the cookie', () => {
    //     const cookie = 'Authentication=; HttpOnly; Path=/; Max-Age=3600';

    //     return request(app.getHttpServer())
    //       .post('/authentication/logout')
    //       .set('set-cookie', cookie)
    //       .send({})
    //       .expect(200);
    //   });
    // });
  });
});
