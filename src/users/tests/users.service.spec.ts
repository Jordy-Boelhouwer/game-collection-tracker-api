import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/userNotFoundException';

describe('UsersService', () => {
  let usersService: UsersService;
  let find: jest.Mock;
  let findOne: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  let update: jest.Mock;

  beforeEach(async () => {
    find = jest.fn();
    findOne = jest.fn();
    create = jest.fn();
    save = jest.fn();
    update = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: { find, findOne, create, save, update },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('when getting a user', () => {
    describe('and a user can be found with the provided email', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        user.email = 'test@test.com';
        user.password = 'Welkom01';
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return the found user', async () => {
        const fetchedUser = await usersService.findOneByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and a user can be found with the provided id', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        user.email = 'test@test.com';
        user.password = 'Welkom01';
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return the found user', async () => {
        const fetchedUser = await usersService.findOneById(1);
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and the user cant be found with the provided email', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          usersService.findOneByEmail('test@test.com'),
        ).rejects.toThrowError(UserNotFoundException);
      });
    });

    describe('and the user cant be found with the provided id', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should throw an UserNotFoundError', async () => {
        await expect(usersService.findOneById(1)).rejects.toThrowError(
          UserNotFoundException,
        );
      });
    });
  });

  describe('when creating a user', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      create.mockReturnValue(Promise.resolve(user));
      save.mockResolvedValue(Promise.resolve(user));
    });
    it('should return the created user', async () => {
      const createdUser = await usersService.create(user);
      expect(createdUser).toEqual(user);
    });
  });
});
