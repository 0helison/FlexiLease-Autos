import { Column, Entity, Generated, ObjectIdColumn } from 'typeorm';
import { IUserToken } from '@modules/users/domain/models/IUserToken';
import { ObjectId } from 'mongodb';

@Entity()
export class UserToken implements IUserToken {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ nullable: false })
  @Generated('uuid')
  token: string;

  @Column({ nullable: false })
  user_id: ObjectId;
}
