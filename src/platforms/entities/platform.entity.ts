import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Platform {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
