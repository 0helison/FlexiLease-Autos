import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { IReserve } from '@modules/reserve/domain/models/IReserve';

@Entity()
export class Reserve implements IReserve {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  _id_user: ObjectId;

  @Column({ nullable: false })
  _id_car: ObjectId;

  @Column({ nullable: false })
  start_date: Date;

  @Column({ nullable: false })
  end_date: Date;

  @Column({ nullable: false })
  final_value: number;
}
