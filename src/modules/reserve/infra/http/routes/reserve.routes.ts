import { Router } from 'express';
import CreateReserveController from '../controllers/CreateReserveController';
import { container } from 'tsyringe';
import { validate } from '@shared/infra/http/middlewares/isValidate';
import { ZodReserveSchema } from '../request/validation/ValidateReserveRequest';
import DeleteReserveController from '../controllers/DeleteReserveController';
import ShowReserveController from '../controllers/ShowReserveController';
import ListReserveController from '../controllers/ListReserveController';
import UpdateReserveController from '../controllers/UpdateReserveController';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticate';
import validateObjectId from '@shared/infra/http/middlewares/isValidId';

const reserveRouter = Router();

const createReserveController = container.resolve(CreateReserveController);
const deleteReserveController = container.resolve(DeleteReserveController);
const showReserveController = container.resolve(ShowReserveController);
const listReserveController = container.resolve(ListReserveController);
const updateReserveController = container.resolve(UpdateReserveController);

reserveRouter.post(
  '/',
  validate(ZodReserveSchema),
  isAuthenticated,
  createReserveController.create,
);
reserveRouter.delete(
  '/:id',
  isAuthenticated,
  validateObjectId,
  deleteReserveController.delete,
);
reserveRouter.get(
  '/:id',
  isAuthenticated,
  validateObjectId,
  showReserveController.show,
);
reserveRouter.get('/', isAuthenticated, listReserveController.index);
reserveRouter.put(
  '/:id',
  validateObjectId,
  validate(ZodReserveSchema),
  isAuthenticated,
  updateReserveController.update,
);

export default reserveRouter;
