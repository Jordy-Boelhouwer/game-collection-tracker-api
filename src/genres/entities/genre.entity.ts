import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from '../../games/entities/game.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => Game, (game: Game) => game.genres)
  public games: Game[];
}
