import { Repository } from 'typeorm';
import { dataSource } from '@shared/infra/typeorm';
import { Reserve } from '../entities/Reserve';
import { IReserveRepository } from '@modules/reserve/domain/repositories/IReserveRepository';
import { ICreateReserve } from '@modules/reserve/domain/models/ICreateReserve';
import { IReserve } from '@modules/reserve/domain/models/IReserve';
import { ObjectId } from 'mongodb';
import { ISearchParamsList } from '@modules/reserve/domain/models/ISearchParamsList';
import { IPaginateReserve } from '@modules/reserve/domain/models/IPaginateReserve';

class ReserveRepository implements IReserveRepository {
  private ormRepository: Repository<Reserve>;

  constructor() {
    this.ormRepository = dataSource.getMongoRepository(Reserve);
  }

  public async create(filds: ICreateReserve): Promise<IReserve> {
    const reserve = this.ormRepository.create(filds);

    await this.ormRepository.save(reserve);

    return reserve;
  }

  public async save(reserve: IReserve): Promise<IReserve> {
    await this.ormRepository.save(reserve);

    return reserve;
  }

  public async findByCarAndDate(
    _id_car: ObjectId,
    start_date: Date,
  ): Promise<IReserve | null> {
    const reserve = await this.ormRepository.findOne({
      where: {
        _id_car: _id_car,
        start_date: start_date,
      },
    });
    return reserve || null;
  }

  public async findByUserId(_id_user: ObjectId): Promise<IReserve[]> {
    const reserves = await this.ormRepository.find({
      where: {
        _id_user: _id_user,
      },
    });
    return reserves;
  }

  public async findById(_id: ObjectId): Promise<IReserve | null> {
    const reserve = await this.ormRepository.findOne({
      where: {
        _id,
      },
    });

    return reserve || null;
  }

  public async remove(reserve: IReserve): Promise<void> {
    await this.ormRepository.remove(reserve);
  }

  public async findAll({
    offset,
    limit,
    _id_user,
    _id_car,
    start_date,
    end_date,
    final_value,
  }: ISearchParamsList): Promise<IPaginateReserve> {
    const where: any = {};

    if (_id_user) {
      where['_id_user'] = new ObjectId(_id_user);
    }
    if (_id_car) {
      where['_id_car'] = new ObjectId(_id_car);
    }
    if (start_date) {
      where['start_date'] = new Date(start_date);
    }
    if (end_date) {
      where['end_date'] = new Date(end_date);
    }
    if (final_value) {
      where['final_value'] = final_value;
    }

    const [reserves, count] = await this.ormRepository.findAndCount({
      where,
      skip: offset,
      take: limit,
    });

    const result: IPaginateReserve = {
      reserves,
      limit,
      total: count,
      offset,
      offsets: Math.ceil(count / limit),
    };

    return result;
  }
}

export default ReserveRepository;
