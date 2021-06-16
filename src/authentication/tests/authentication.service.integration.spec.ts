import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../../users/users.service';
import { MockedJwtService } from '../../utils/mocks/jwt.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import mockedUser from './user.mock';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('bcrypt');
describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let bcryptCompare: jest.Mock;
  let userData: User;
  let findUser: jest.Mock;
  let createUser: jest.Mock;
  let saveUser: jest.Mock;

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    userData = {
      ...mockedUser,
    };

    findUser = jest.fn().mockResolvedValue(userData);
    createUser = jest.fn().mockResolvedValue(userData);
    saveUser = jest.fn().mockResolvedValue(userData);

    const usersRepository = {
      findOne: findUser,
      create: createUser,
      save: saveUser,
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
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
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    usersService = module.get<UsersService>(UsersService);
  });

  describe('when accessing the data of the authenticating user', () => {
    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an HttpException', async () => {
        await expect(
          authenticationService.getAuthenticatedUser(
            'user@email.com',
            'strongPassword',
          ),
        ).rejects.toThrowError('Wrong credentials provided');
      });
    });

    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });
        it('should return the user data', async () => {
          const user = await authenticationService.getAuthenticatedUser(
            'user@email.com',
            'hash',
          );
          expect(user).toBe(userData);
        });
      });
      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });
        it('should throw an error', async () => {
          await expect(
            authenticationService.getAuthenticatedUser(
              'user@email.com',
              'strongPassword',
            ),
          ).rejects.toThrowError('Wrong credentials provided');
        });
      });
    });
  });

  describe('when registering a user', () => {
    describe('and the email already exists', () => {
      beforeEach(() => {
        saveUser.mockRejectedValue(
          new HttpException(
            'User with that email already exists',
            HttpStatus.BAD_REQUEST,
          ),
        );
      });
      it('should return a HttpException', () => {
        expect(authenticationService.register).rejects.toThrowError(
          HttpException,
        );
      });
    });
    describe('and the email is unique', () => {
      it('should return the created developer', async () => {
        const user = await authenticationService.register(userData);
        expect(user).toEqual(userData);
      });
    });
  });
});
