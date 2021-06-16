import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Platform } from '../entities/platform.entity';
import { PlatformsService } from '../platforms.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import { MockedPlatforms } from './platform.mock';
import { PlatformNotFoundException } from '../exceptions/platformNotFound.exception';

describe('PlatformsService', () => {
  let platformsService: PlatformsService;
  let platformData: Platform[];
  let findAllPlatforms: jest.Mock;
  let findPlatform: jest.Mock;
  let createPlatform: jest.Mock;
  let savePlatform: jest.Mock;
  let updatePlatform: jest.Mock;

  beforeEach(async () => {
    platformData = {
      ...MockedPlatforms,
    };

    findAllPlatforms = jest.fn().mockResolvedValue(platformData);
    findPlatform = jest.fn().mockResolvedValue(platformData[0]);
    createPlatform = jest.fn().mockReturnValue(platformData[0]);
    savePlatform = jest.fn().mockResolvedValue(platformData[0]);
    updatePlatform = jest.fn().mockResolvedValue(platformData[0]);

    const platformsRepository = {
      find: findAllPlatforms,
      findOne: findPlatform,
      create: createPlatform,
      save: savePlatform,
      update: updatePlatform,
    };

    const module = await Test.createTestingModule({
      providers: [
        PlatformsService,
        {
          provide: ConfigService,
          useValue: MockedConfigService,
        },
        {
          provide: getRepositoryToken(Platform),
          useValue: platformsRepository,
        },
      ],
    }).compile();
    platformsService = module.get<PlatformsService>(PlatformsService);
  });

  describe('when accessing the data of all platforms', () => {
    it('should return all platform data', async () => {
      const platforms = await platformsService.findAll();
      expect(platforms).toBe(platformData);
    });
  });

  describe('when accessing the data of a single platform', () => {
    describe('and the provided id is not valid', () => {
      beforeEach(() => {
        findPlatform.mockResolvedValue(undefined);
      });
      it('should throw an PlatformNotFoundException', async () => {
        expect(platformsService.findOneById).rejects.toThrowError(
          PlatformNotFoundException,
        );
      });
    });

    describe('and the provided id is valid', () => {
      it('should return the platform', async () => {
        const platform = await platformsService.findOneById(1);
        expect(platform).toEqual(platformData[0]);
      });
    });
  });

  describe('when creating a platform', () => {
    it('should return the created platform', async () => {
      const platform = await platformsService.create(platformData[0]);
      expect(platform).toEqual(platformData[0]);
    });
  });

  describe('when updating a platform', () => {
    describe('and the platform is not found', () => {
      beforeEach(() => {
        findPlatform.mockResolvedValue(undefined);
      });
      it('should throw a PlatformNotFoundException', async () => {
        expect(
          platformsService.update(1, platformData[0]),
        ).rejects.toThrowError(PlatformNotFoundException);
      });
    });

    describe('and the platform is found', () => {
      it('should return the updated platform', async () => {
        const platform = await platformsService.update(
          platformData[0].id,
          platformData[0],
        );
        expect(platform).toEqual(platformData[0]);
      });
    });
  });

  describe('when removing a platform', () => {
    describe('and the platform is not found', () => {
      beforeEach(() => {
        findPlatform.mockResolvedValue(undefined);
      });
      it('should throw a PlatformNotFoundException', async () => {
        expect(platformsService.remove(1)).rejects.toThrowError(
          PlatformNotFoundException,
        );
      });
    });

    describe('and the platform is found', () => {
      it('should return an empty object', async () => {
        expect(platformsService.remove(1)).resolves.toEqual({});
      });
    });
  });
});
