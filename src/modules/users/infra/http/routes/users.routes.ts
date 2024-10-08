import { Router } from 'express';
import { container } from 'tsyringe';
import CreateUserController from '../controllers/CreateUserController';
import { validate } from '@shared/infra/http/middlewares/isValidate';
import { ZodUserSchema } from '../request/validation/ValidateUserRequest';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticate';
import DeleteUserController from '../controllers/DeleteUserController';
import ShowUserController from '../controllers/ShowUserController';
import ListUsersController from '../controllers/ListUserController';
import UpdateUserController from '../controllers/UpdateUserController';
import validateObjectId from '@shared/infra/http/middlewares/isValidId';

const usersRouter = Router();

const createUsersController = container.resolve(CreateUserController);
const deleteUsersController = container.resolve(DeleteUserController);
const showUsersController = container.resolve(ShowUserController);
const listUsersController = container.resolve(ListUsersController);
const updateUsersController = container.resolve(UpdateUserController);

usersRouter.post('/', validate(ZodUserSchema), createUsersController.create);
usersRouter.delete(
  '/:id',
  isAuthenticated,
  validateObjectId,
  deleteUsersController.delete,
);
usersRouter.get(
  '/:id',
  isAuthenticated,
  validateObjectId,
  showUsersController.show,
);
usersRouter.get('/', isAuthenticated, listUsersController.index);
usersRouter.put(
  '/:id',
  validateObjectId,
  validate(ZodUserSchema),
  isAuthenticated,
  updateUsersController.update,
);

export default usersRouter;
