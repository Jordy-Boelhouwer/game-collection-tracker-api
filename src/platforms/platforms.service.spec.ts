import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlatformsService } from './platforms.service';
import { Platform } from './entities/platform.entity';
import { PlatformNotFoundException } from './exceptions/platformNotFound.exception';

describe('PlatformsService', () => {
  let platformsService: PlatformsService;
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
        PlatformsService,
        {
          provide: getRepositoryToken(Platform),
          useValue: { find, findOne, create, save, update },
        },
      ],
    }).compile();

    platformsService = module.get<PlatformsService>(PlatformsService);
  });

  describe('when getting all platforms', () => {
    let platforms: Platform[];
    beforeEach(() => {
      platforms = [new Platform()];
      find.mockReturnValue(Promise.resolve(platforms));
    });
    it('should return a array of platforms', async () => {
      const fetchedPlatforms = await platformsService.findAll();
      expect(fetchedPlatforms).toEqual(platforms);
    });
  });

  describe('when getting a platform by id', () => {
    describe('and the platform is found', () => {
      let platform: Platform;
      beforeEach(() => {
        platform = new Platform();
        findOne.mockResolvedValue(Promise.resolve(platform));
      });

      it('should return the platform', async () => {
        const fetchedPlatform = await platformsService.findOneById(1);
        expect(fetchedPlatform).toEqual(platform);
      });
    });

    describe('and the platform is not found', () => {
      beforeEach(() => {
        findOne.mockRejectedValue(undefined);
      });

      it('should throw a PlatformNotFoundException', async () => {
        expect(platformsService.findOneById(1)).rejects.toThrowError(
          PlatformNotFoundException,
        );
      });
    });
  });
});
