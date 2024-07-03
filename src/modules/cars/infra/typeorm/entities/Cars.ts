import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { IAccessory, ICar } from '@modules/cars/domain/models/ICar';

@Entity()
export class Car implements ICar {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: false })
  color: string;

  @Column({ nullable: false })
  year: string;

  @Column({ nullable: false })
  value_per_day: number;

  @Column({ nullable: false })
  number_of_passengers: number;

  @Column('simple-array')
  accessories: IAccessory[];
}
