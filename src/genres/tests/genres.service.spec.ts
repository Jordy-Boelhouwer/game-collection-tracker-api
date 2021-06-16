import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenresService } from '../genres.service';
import { Genre } from '../entities/genre.entity';
import { GenreNotFoundException } from '../exceptions/genreNotFound.exception';

describe('GenresService', () => {
  let genresService: GenresService;
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
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: { find, findOne, create, save, update },
        },
      ],
    }).compile();

    genresService = module.get<GenresService>(GenresService);
  });

  describe('when getting all genres', () => {
    let genres: Genre[];
    beforeEach(() => {
      genres = [new Genre()];
      find.mockReturnValue(Promise.resolve(genres));
    });
    it('should return a array of genres', async () => {
      const fetchedGenres = await genresService.findAll();
      expect(fetchedGenres).toEqual(genres);
    });
  });

  describe('when getting a genre by id', () => {
    describe('and the genre is found', () => {
      let genre: Genre;
      beforeEach(() => {
        genre = new Genre();
        findOne.mockResolvedValue(Promise.resolve(genre));
      });

      it('should return the genre', async () => {
        const fetchedGenre = await genresService.findOneById(1);
        expect(fetchedGenre).toEqual(genre);
      });
    });

    describe('and the genre is not found', () => {
      beforeEach(() => {
        findOne.mockRejectedValue(undefined);
      });

      it('should throw a GenreNotFoundException', async () => {
        expect(genresService.findOneById(1)).rejects.toThrowError(
          GenreNotFoundException,
        );
      });
    });
  });

  describe('when creating a genre', () => {
    let genre: Genre;
    beforeEach(() => {
      genre = new Genre();
      create.mockReturnValue(Promise.resolve(genre));
      save.mockResolvedValue(Promise.resolve(genre));
    });
    it('should return the created genre', async () => {
      const createdGenre = await genresService.create(genre);
      expect(createdGenre).toEqual(genre);
    });
  });

  describe('when updating a genre', () => {
    describe('and the genre is found with the provided id', () => {
      let genre: Genre;
      beforeEach(() => {
        genre = new Genre();
        update.mockResolvedValue(Promise.resolve(genre));
        findOne.mockResolvedValue(Promise.resolve(genre));
      });
      it('should return the updated genre', async () => {
        const updatedGenre = await genresService.update(1, genre);
        expect(updatedGenre).toEqual(genre);
      });
    });

    describe('and the genre is not found with the provided id', () => {
      beforeEach(() => {
        findOne.mockResolvedValue(undefined);
      });
      it('should throw a GenreNotFoundException', async () => {
        expect(genresService.update).rejects.toThrowError(
          GenreNotFoundException,
        );
      });
    });
  });
});
