import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from '../entities/genre.entity';
import { GenresService } from '../genres.service';
import { MockedConfigService } from '../../utils/mocks/config.service';
import { MockedGenres } from './genre.mock';
import { GenreNotFoundException } from '../exceptions/genreNotFound.exception';

describe('GenresService', () => {
  let genresService: GenresService;
  let genreData: Genre[];
  let findAllGenres: jest.Mock;
  let findGenre: jest.Mock;
  let createGenre: jest.Mock;
  let saveGenre: jest.Mock;
  let updateGenre: jest.Mock;

  beforeEach(async () => {
    genreData = {
      ...MockedGenres,
    };

    findAllGenres = jest.fn().mockResolvedValue(genreData);
    findGenre = jest.fn().mockResolvedValue(genreData[0]);
    createGenre = jest.fn().mockReturnValue(genreData[0]);
    saveGenre = jest.fn().mockResolvedValue(genreData[0]);
    updateGenre = jest.fn().mockResolvedValue(genreData[0]);

    const genresRepository = {
      find: findAllGenres,
      findOne: findGenre,
      create: createGenre,
      save: saveGenre,
      update: updateGenre,
    };

    const module = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: ConfigService,
          useValue: MockedConfigService,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: genresRepository,
        },
      ],
    }).compile();
    genresService = module.get<GenresService>(GenresService);
  });

  describe('when accessing the data of all genres', () => {
    it('should return all genre data', async () => {
      const genres = await genresService.findAll();
      expect(genres).toBe(genreData);
    });
  });

  describe('when accessing the data of a single genre', () => {
    describe('and the provided id is not valid', () => {
      beforeEach(() => {
        findGenre.mockResolvedValue(undefined);
      });
      it('should throw an GenreNotFoundException', async () => {
        expect(genresService.findOneById).rejects.toThrowError(
          GenreNotFoundException,
        );
      });
    });

    describe('and the provided id is valid', () => {
      it('should return the genre', async () => {
        const genre = await genresService.findOneById(1);
        expect(genre).toEqual(genreData[0]);
      });
    });
  });

  describe('when creating a genre', () => {
    it('should return the created genre', async () => {
      const genre = await genresService.create(genreData[0]);
      expect(genre).toEqual(genreData[0]);
    });
  });

  describe('when updating a genre', () => {
    describe('and the genre is not found', () => {
      beforeEach(() => {
        findGenre.mockResolvedValue(undefined);
      });
      it('should throw a GenreNotFoundException', async () => {
        expect(genresService.update(1, genreData[0])).rejects.toThrowError(
          GenreNotFoundException,
        );
      });
    });

    describe('and the genre is found', () => {
      it('should return the updated genre', async () => {
        const genre = await genresService.update(genreData[0].id, genreData[0]);
        expect(genre).toEqual(genreData[0]);
      });
    });
  });

  describe('when removing a genre', () => {
    describe('and the genre is not found', () => {
      beforeEach(() => {
        findGenre.mockResolvedValue(undefined);
      });
      it('should throw a GenreNotFoundException', async () => {
        expect(genresService.remove(1)).rejects.toThrowError(
          GenreNotFoundException,
        );
      });
    });

    describe('and the genre is found', () => {
      it('should return an empty object', async () => {
        expect(genresService.remove(1)).resolves.toEqual({});
      });
    });
  });
});
