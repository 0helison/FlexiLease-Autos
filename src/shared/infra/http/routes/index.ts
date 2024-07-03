import carsRouter from '@modules/cars/infra/http/routes/car.routes';
import reserveRouter from '@modules/reserve/infra/http/routes/reserve.routes';
import authRouter from '@modules/users/infra/http/routes/auth.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/api/v1/user', usersRouter);
routes.use('/api/v1/auth', authRouter);
routes.use('/api/v1/car', carsRouter);
routes.use('/api/v1/reserve', reserveRouter);

export default routes;
