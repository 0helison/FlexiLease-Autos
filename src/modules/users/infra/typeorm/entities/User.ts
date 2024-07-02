import { IUser } from '@modules/users/domain/models/IUser';
import { Exclude } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class User implements IUser {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  cpf: string;

  @Column({ nullable: false })
  birthday: Date;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: false })
  qualified: 'yes' | 'no';

  @Column({ nullable: false })
  cep: string;

  @Column({ nullable: false })
  complement: string;

  @Column({ nullable: false })
  neighborhood: string;

  @Column({ nullable: false })
  locality: string;

  @Column({ nullable: false })
  uf: string;
}
