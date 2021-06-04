import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockedConfigService } from '../utils/mocks/config.service';
import { MockedJwtService } from '../utils/mocks/jwt.service';

jest.mock('bcrypt');
describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let create: jest.Mock;
  let save: jest.Mock;
  let findOne: jest.Mock;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();
    save = jest.fn();
    findOne = jest.fn();
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
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
          useValue: { create, save, findOne },
        },
      ],
    }).compile();
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    usersService = module.get<UsersService>(UsersService);
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });
  });

  describe('when registering a user', () => {
    describe('and the email is unique', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        user.email = 'test@test.nl';
        user.password = 'Welkom01';
        create.mockReturnValue(Promise.resolve(user));
        save.mockResolvedValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const createdUser = await authenticationService.register(user);
        expect(createdUser).toEqual(user);
      });
    });

    describe('and the email is not unique', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        save.mockRejectedValue(new Error());
      });
      it('should throw an error', async () => {
        await expect(authenticationService.register(user)).rejects.toThrow();
      });
    });
  });

  describe('when getting an authenticated user', () => {
    describe('and the correct credentials are provided', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        user.email = 'test@test.com';
        user.password = 'Welkom01';
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return the authenticated user', async () => {
        const fetchedUser = await authenticationService.getAuthenticatedUser(
          'test@test.com',
          'Welkom01',
        );
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and the user cant be found with the provided email', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          authenticationService.getAuthenticatedUser(
            'test@test.com',
            'Welkom01',
          ),
        ).rejects.toThrow();
      });
    });

    describe('and the provided password is not correct', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an error', async () => {
        await expect(
          authenticationService.getAuthenticatedUser(
            'test@test.com',
            'Welkom01',
          ),
        ).rejects.toThrow();
      });
    });
  });
});
