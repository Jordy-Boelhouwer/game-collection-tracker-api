import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PublishersService } from '../publishers.service';
import { Publisher } from '../entities/publisher.entity';
import { PublisherNotFoundException } from '../exceptions/publisherNotFound.exception';

describe('PublishersService', () => {
  let publishersService: PublishersService;
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
        PublishersService,
        {
          provide: getRepositoryToken(Publisher),
          useValue: { find, findOne, create, save, update },
        },
      ],
    }).compile();

    publishersService = module.get<PublishersService>(PublishersService);
  });

  describe('when getting all publishers', () => {
    let publishers: Publisher[];
    beforeEach(() => {
      publishers = [new Publisher()];
      find.mockReturnValue(Promise.resolve(publishers));
    });
    it('should return a array of publishers', async () => {
      const fetchedPublishers = await publishersService.findAll();
      expect(fetchedPublishers).toEqual(publishers);
    });
  });

  describe('when getting a publisher by id', () => {
    describe('and the publisher is found', () => {
      let publisher: Publisher;
      beforeEach(() => {
        publisher = new Publisher();
        findOne.mockResolvedValue(Promise.resolve(publisher));
      });

      it('should return the publisher', async () => {
        const fetchedPublisher = await publishersService.findOneById(1);
        expect(fetchedPublisher).toEqual(publisher);
      });
    });

    describe('and the publisher is not found', () => {
      beforeEach(() => {
        findOne.mockRejectedValue(undefined);
      });

      it('should throw a PublisherNotFoundException', async () => {
        expect(publishersService.findOneById(1)).rejects.toThrowError(
          PublisherNotFoundException,
        );
      });
    });
  });

  describe('when creating a publisher', () => {
    let publisher: Publisher;
    beforeEach(() => {
      publisher = new Publisher();
      create.mockReturnValue(Promise.resolve(publisher));
      save.mockResolvedValue(Promise.resolve(publisher));
    });
    it('should return the created publisher', async () => {
      const createdPublisher = await publishersService.create(publisher);
      expect(createdPublisher).toEqual(publisher);
    });
  });

  describe('when updating a publisher', () => {
    describe('and the publisher is found with the provided id', () => {
      let publisher: Publisher;
      beforeEach(() => {
        publisher = new Publisher();
        update.mockResolvedValue(Promise.resolve(publisher));
        findOne.mockResolvedValue(Promise.resolve(publisher));
      });
      it('should return the updated publisher', async () => {
        const updatedPublisher = await publishersService.update(1, publisher);
        expect(updatedPublisher).toEqual(publisher);
      });
    });

    describe('and the publisher is not found with the provided id', () => {
      beforeEach(() => {
        findOne.mockResolvedValue(undefined);
      });
      it('should throw a PublisherNotFoundException', async () => {
        expect(publishersService.update).rejects.toThrowError(
          PublisherNotFoundException,
        );
      });
    });
  });
});
