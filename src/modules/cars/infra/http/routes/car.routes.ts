import { Router } from 'express';
import { container } from 'tsyringe';
import CreateCarController from '../controllers/CreateCarController';
import { validate } from '@shared/infra/http/middlewares/isValidate';
import { ZodCarSchema } from '../request/validation/ValidateCarRequest';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticate';
import DeleteCarController from '../controllers/DeleteCarController';
import ShowCarController from '../controllers/ShowCarController';
import UpdateCarController from '../controllers/UpdateCarController';
import ListCarController from '../controllers/ListCarController';
import UpdateAccessoriesController from '../controllers/UpdateAccessoriesController';
import { ZodCarUpdateAccessorySchema } from '../request/validation/ValidateCarUpdateAcessory';
import { ZodCarUpdateSchema } from '../request/validation/ValidateCarRequestUpdate';

const carsRouter = Router();

const createCarsController = container.resolve(CreateCarController);
const deleteCarsController = container.resolve(DeleteCarController);
const showCarsController = container.resolve(ShowCarController);
const updateCarsController = container.resolve(UpdateCarController);
const listCarsController = container.resolve(ListCarController);
const updateAccessoriesController = container.resolve(
  UpdateAccessoriesController,
);

carsRouter.post(
  '/',
  isAuthenticated,
  validate(ZodCarSchema),
  createCarsController.create,
);
carsRouter.delete('/:id', isAuthenticated, deleteCarsController.delete);
carsRouter.get('/:id', isAuthenticated, showCarsController.show);
carsRouter.put(
  '/:id',
  isAuthenticated,
  validate(ZodCarUpdateSchema),
  updateCarsController.update,
);
carsRouter.get('/', isAuthenticated, listCarsController.index);
carsRouter.patch(
  '/:id/accessories/:accessoryId',
  isAuthenticated,
  validate(ZodCarUpdateAccessorySchema),
  updateAccessoriesController.patch,
);

export default carsRouter;
