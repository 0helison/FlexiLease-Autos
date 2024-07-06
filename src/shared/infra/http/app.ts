import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json';
import '@shared/infra/typeorm';
import '@shared/container';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);
app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(errorHandlerMiddleware);

export { app };
