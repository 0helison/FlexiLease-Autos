import { ObjectId } from 'mongodb';
import { IReserveRepository } from '@modules/reserve/domain/repositories/IReserveRepository';
import { ICreateReserve } from '@modules/reserve/domain/models/ICreateReserve';
import { IReserve } from '@modules/reserve/domain/models/IReserve';
import { ISearchParamsList } from '@modules/reserve/domain/models/ISearchParamsList';
import { IPaginateReserve } from '@modules/reserve/domain/models/IPaginateReserve';

class ReserveRepositoryInMemory implements IReserveRepository {
  private reserves: IReserve[] = [];

  public async create(fields: ICreateReserve): Promise<IReserve> {
    const reserve: IReserve = {
      _id: new ObjectId(),
      ...fields,
      final_value: fields.final_value || 0,
    };

    this.reserves.push(reserve);

    return reserve;
  }

  public async save(reserve: IReserve): Promise<IReserve> {
    const findIndex = this.reserves.findIndex(findReserve =>
      findReserve._id.equals(reserve._id),
    );

    this.reserves[findIndex] = reserve;

    return reserve;
  }

  public async findByCarAndDate(
    _id_car: ObjectId,
    start_date: Date,
  ): Promise<IReserve | null> {
    const reserve = this.reserves.find(
      r => r._id_car.equals(_id_car) && r.start_date === start_date,
    );
    return reserve || null;
  }

  public async findByUserId(_id_user: ObjectId): Promise<IReserve[]> {
    const reserves = this.reserves.filter(r => r._id_user.equals(_id_user));
    return reserves;
  }

  public async findById(_id: ObjectId): Promise<IReserve | null> {
    const reserve = this.reserves.find(r => r._id.equals(_id));
    return reserve || null;
  }

  public async remove(reserve: IReserve): Promise<void> {
    this.reserves = this.reserves.filter(r => !r._id.equals(reserve._id));
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
    let filteredReserves = [...this.reserves];

    if (_id_user) {
      filteredReserves = filteredReserves.filter(r =>
        r._id_user.equals(_id_user),
      );
    }
    if (_id_car) {
      filteredReserves = filteredReserves.filter(r =>
        r._id_car.equals(_id_car),
      );
    }
    if (start_date) {
      filteredReserves = filteredReserves.filter(
        r => r.start_date === start_date,
      );
    }
    if (end_date) {
      filteredReserves = filteredReserves.filter(r => r.end_date === end_date);
    }
    if (final_value) {
      filteredReserves = filteredReserves.filter(
        r => r.final_value === final_value,
      );
    }

    const count = filteredReserves.length;
    const offsets = Math.ceil(count / limit);
    const results = filteredReserves.slice(offset, offset + limit);

    const result: IPaginateReserve = {
      reserves: results,
      limit,
      total: count,
      offset,
      offsets,
    };

    return result;
  }
}

export default ReserveRepositoryInMemory;
