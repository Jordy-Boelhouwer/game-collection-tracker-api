import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Developer } from '../entities/developer.entity';
import { DevelopersService } from '../developers.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import { MockedDevelopers } from './developer.mock';
import { DeveloperNotFoundException } from '../exceptions/developerNotFound.exception';

describe('DevelopersService', () => {
  let developersService: DevelopersService;
  let developerData: Developer[];
  let findAllDevelopers: jest.Mock;
  let findDeveloper: jest.Mock;
  let createDeveloper: jest.Mock;
  let saveDeveloper: jest.Mock;
  let updateDeveloper: jest.Mock;

  beforeEach(async () => {
    developerData = {
      ...MockedDevelopers,
    };

    findAllDevelopers = jest.fn().mockResolvedValue(developerData);
    findDeveloper = jest.fn().mockResolvedValue(developerData[0]);
    createDeveloper = jest.fn().mockReturnValue(developerData[0]);
    saveDeveloper = jest.fn().mockResolvedValue(developerData[0]);
    updateDeveloper = jest.fn().mockResolvedValue(developerData[0]);

    const developersRepository = {
      find: findAllDevelopers,
      findOne: findDeveloper,
      create: createDeveloper,
      save: saveDeveloper,
      update: updateDeveloper,
    };

    const module = await Test.createTestingModule({
      providers: [
        DevelopersService,
        {
          provide: ConfigService,
          useValue: MockedConfigService,
        },
        {
          provide: getRepositoryToken(Developer),
          useValue: developersRepository,
        },
      ],
    }).compile();
    developersService = module.get<DevelopersService>(DevelopersService);
  });

  describe('when accessing the data of all developers', () => {
    it('should return all developer data', async () => {
      const developers = await developersService.findAll();
      expect(developers).toBe(developerData);
    });
  });

  describe('when accessing the data of a single developer', () => {
    describe('and the provided id is not valid', () => {
      beforeEach(() => {
        findDeveloper.mockResolvedValue(undefined);
      });
      it('should throw an DeveloperNotFoundException', async () => {
        expect(developersService.findOneById).rejects.toThrowError(
          DeveloperNotFoundException,
        );
      });
    });

    describe('and the provided id is valid', () => {
      it('should return the developer', async () => {
        const developer = await developersService.findOneById(1);
        expect(developer).toEqual(developerData[0]);
      });
    });
  });

  describe('when creating a developer', () => {
    it('should return the created developer', async () => {
      const developer = await developersService.create(developerData[0]);
      expect(developer).toEqual(developerData[0]);
    });
  });

  describe('when updating a developer', () => {
    describe('and the developer is not found', () => {
      beforeEach(() => {
        findDeveloper.mockResolvedValue(undefined);
      });
      it('should throw a DeveloperNotFoundException', async () => {
        expect(
          developersService.update(1, developerData[0]),
        ).rejects.toThrowError(DeveloperNotFoundException);
      });
    });

    describe('and the developer is found', () => {
      it('should return the updated developer', async () => {
        const developer = await developersService.update(
          developerData[0].id,
          developerData[0],
        );
        expect(developer).toEqual(developerData[0]);
      });
    });
  });

  describe('when removing a developer', () => {
    describe('and the developer is not found', () => {
      beforeEach(() => {
        findDeveloper.mockResolvedValue(undefined);
      });
      it('should throw a DeveloperNotFoundException', async () => {
        expect(developersService.remove(1)).rejects.toThrowError(
          DeveloperNotFoundException,
        );
      });
    });

    describe('and the developer is found', () => {
      it('should return an empty object', async () => {
        expect(developersService.remove(1)).resolves.toEqual({});
      });
    });
  });
});
