import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NobelPrizesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({
    unique: false,
    nullable: true,
  })
  awardDate: Date;

  @Column()
  awardYear: string;

  @Column()
  price: number;
}
