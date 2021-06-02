import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public coverArt: string;

  @Column({ nullable: true })
  public priceLoose: string;

  @Column({ nullable: true })
  public priceCIB: string;

  @Column({ nullable: true })
  public priceNew: string;

  @Column({ nullable: true })
  public release: Date;
}
