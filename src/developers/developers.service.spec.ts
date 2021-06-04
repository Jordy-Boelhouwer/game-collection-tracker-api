import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';
import { DeveloperNotFoundException } from './exceptions/developerNotFound.exception';

describe('DevelopersService', () => {
  let developersService: DevelopersService;
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
        DevelopersService,
        {
          provide: getRepositoryToken(Developer),
          useValue: { find, findOne, create, save, update },
        },
      ],
    }).compile();

    developersService = module.get<DevelopersService>(DevelopersService);
  });

  describe('when getting all developers', () => {
    let developers: Developer[];
    beforeEach(() => {
      developers = [new Developer()];
      find.mockReturnValue(Promise.resolve(developers));
    });
    it('should return a array of developers', async () => {
      const fetchedDevelopers = await developersService.findAll();
      expect(fetchedDevelopers).toEqual(developers);
    });
  });

  describe('when getting a developer by id', () => {
    describe('and the developer is found', () => {
      let developer: Developer;
      beforeEach(() => {
        developer = new Developer();
        findOne.mockResolvedValue(Promise.resolve(developer));
      });

      it('should return the developer', async () => {
        const fetchedDeveloper = await developersService.findOneById(1);
        expect(fetchedDeveloper).toEqual(developer);
      });
    });

    describe('and the developer is not found', () => {
      beforeEach(() => {
        findOne.mockRejectedValue(undefined);
      });

      it('should throw a DeveloperNotFoundException', async () => {
        expect(developersService.findOneById(1)).rejects.toThrowError(
          DeveloperNotFoundException,
        );
      });
    });
  });

  describe('when creating a developer', () => {
    let developer: Developer;
    beforeEach(() => {
      developer = new Developer();
      create.mockReturnValue(Promise.resolve(developer));
      save.mockResolvedValue(Promise.resolve(developer));
    });
    it('should return the created developer', async () => {
      const createdDeveloper = await developersService.create(developer);
      expect(createdDeveloper).toEqual(developer);
    });
  });

  describe('when updating a developer', () => {
    describe('and the developer is found with the provided id', () => {
      let developer: Developer;
      beforeEach(() => {
        developer = new Developer();
        update.mockResolvedValue(Promise.resolve(developer));
        findOne.mockResolvedValue(Promise.resolve(developer));
      });
      it('should return the updated developer', async () => {
        const updatedDeveloper = await developersService.update(1, developer);
        expect(updatedDeveloper).toEqual(developer);
      });
    });

    describe('and the developer is not found with the provided id', () => {
      beforeEach(() => {
        findOne.mockResolvedValue(undefined);
      });
      it('should throw a DeveloperNotFoundException', async () => {
        expect(developersService.update).rejects.toThrowError(
          DeveloperNotFoundException,
        );
      });
    });
  });
});
