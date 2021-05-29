import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column()
  public coverArt: string;

  @Column()
  public priceLoose: string;

  @Column()
  public priceCIB: string;

  @Column()
  public priceNew: string;

  @Column()
  public release: Date;
}
