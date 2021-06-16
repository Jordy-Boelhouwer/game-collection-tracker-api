import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';

@Entity()
export class Developer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => Game, (game: Game) => game.developers)
  @JoinTable({ name: 'game_developer' })
  public games?: Game[];
}
