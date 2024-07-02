import { Router } from 'express';
import { container } from 'tsyringe';
import { validate } from '@shared/infra/http/middlewares/isValidate';
import { ZodAuthSchema } from '../request/validation/ValidateAuthRequest';
import AuthController from '../controllers/AuthController';

const authRouter = Router();

const authController = container.resolve(AuthController);

authRouter.post('/', validate(ZodAuthSchema), authController.create);

export default authRouter;
