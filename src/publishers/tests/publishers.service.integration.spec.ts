import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Publisher } from '../entities/publisher.entity';
import { PublishersService } from '../publishers.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import { MockedPublishers } from './publisher.mock';
import { PublisherNotFoundException } from '../exceptions/publisherNotFound.exception';

describe('PublishersService', () => {
  let publishersService: PublishersService;
  let publisherData: Publisher[];
  let findAllPublishers: jest.Mock;
  let findPublisher: jest.Mock;
  let createPublisher: jest.Mock;
  let savePublisher: jest.Mock;
  let updatePublisher: jest.Mock;

  beforeEach(async () => {
    publisherData = {
      ...MockedPublishers,
    };

    findAllPublishers = jest.fn().mockResolvedValue(publisherData);
    findPublisher = jest.fn().mockResolvedValue(publisherData[0]);
    createPublisher = jest.fn().mockReturnValue(publisherData[0]);
    savePublisher = jest.fn().mockResolvedValue(publisherData[0]);
    updatePublisher = jest.fn().mockResolvedValue(publisherData[0]);

    const publishersRepository = {
      find: findAllPublishers,
      findOne: findPublisher,
      create: createPublisher,
      save: savePublisher,
      update: updatePublisher,
    };

    const module = await Test.createTestingModule({
      providers: [
        PublishersService,
        {
          provide: ConfigService,
          useValue: MockedConfigService,
        },
        {
          provide: getRepositoryToken(Publisher),
          useValue: publishersRepository,
        },
      ],
    }).compile();
    publishersService = module.get<PublishersService>(PublishersService);
  });

  describe('when accessing the data of all publishers', () => {
    it('should return all publisher data', async () => {
      const publishers = await publishersService.findAll();
      expect(publishers).toBe(publisherData);
    });
  });

  describe('when accessing the data of a single publisher', () => {
    describe('and the provided id is not valid', () => {
      beforeEach(() => {
        findPublisher.mockResolvedValue(undefined);
      });
      it('should throw an PublisherNotFoundException', async () => {
        expect(publishersService.findOneById).rejects.toThrowError(
          PublisherNotFoundException,
        );
      });
    });

    describe('and the provided id is valid', () => {
      it('should return the publisher', async () => {
        const publisher = await publishersService.findOneById(1);
        expect(publisher).toEqual(publisherData[0]);
      });
    });
  });

  describe('when creating a publisher', () => {
    it('should return the created publisher', async () => {
      const publisher = await publishersService.create(publisherData[0]);
      expect(publisher).toEqual(publisherData[0]);
    });
  });

  describe('when updating a publisher', () => {
    describe('and the publisher is not found', () => {
      beforeEach(() => {
        findPublisher.mockResolvedValue(undefined);
      });
      it('should throw a PublisherNotFoundException', async () => {
        expect(
          publishersService.update(1, publisherData[0]),
        ).rejects.toThrowError(PublisherNotFoundException);
      });
    });

    describe('and the publisher is found', () => {
      it('should return the updated publisher', async () => {
        const publisher = await publishersService.update(
          publisherData[0].id,
          publisherData[0],
        );
        expect(publisher).toEqual(publisherData[0]);
      });
    });
  });

  describe('when removing a publisher', () => {
    describe('and the publisher is not found', () => {
      beforeEach(() => {
        findPublisher.mockResolvedValue(undefined);
      });
      it('should throw a PublisherNotFoundException', async () => {
        expect(publishersService.remove(1)).rejects.toThrowError(
          PublisherNotFoundException,
        );
      });
    });

    describe('and the publisher is found', () => {
      it('should return an empty object', async () => {
        expect(publishersService.remove(1)).resolves.toEqual({});
      });
    });
  });
});
