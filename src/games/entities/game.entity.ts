import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Publisher } from '../../publishers/entities/publisher.entity';
import { Developer } from '../../developers/entities/developer.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Platform } from '../../platforms/entities/platform.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
  public description?: string;

  @Column({ nullable: true })
  public coverArt?: string;

  @Column({ nullable: true })
  public priceLoose?: string;

  @Column({ nullable: true })
  public priceCIB?: string;

  @Column({ nullable: true })
  public priceNew?: string;

  @Column({ nullable: true })
  public release?: Date;

  @ManyToOne(() => Publisher, (publisher: Publisher) => publisher.games)
  public publisher?: Publisher;

  @ManyToMany(() => Developer, (developer: Developer) => developer.games)
  public developers?: Developer[];

  @ManyToMany(() => Genre, (genre: Genre) => genre.games)
  @JoinTable({ name: 'game_genre' })
  public genres?: Genre[];

  @ManyToMany(() => Platform, (platform: Platform) => platform.games)
  @JoinTable({ name: 'game_version' })
  public platforms?: Platform[];

  @ManyToMany(() => User, (user: User) => user.games)
  public owners?: User[];
}
