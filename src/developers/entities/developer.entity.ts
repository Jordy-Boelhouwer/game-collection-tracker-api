import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Developer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
