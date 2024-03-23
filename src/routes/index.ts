import { Request, Response, Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import { DATA_NOT_FOUND } from '../types/status';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);
routes.use((req: Request, res: Response) => res.status(DATA_NOT_FOUND).send({ message: 'Page Not Found' }));

export default routes;