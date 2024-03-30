import { NextFunction, Request, Response, Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import notFoundError from '../errors/NotFoundError';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);
routes.use((req: Request, res: Response, next:NextFunction) => next(new notFoundError('Page Not Found')));

export default routes;