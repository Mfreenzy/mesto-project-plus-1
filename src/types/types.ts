import { Request } from 'express';

export interface IRequest extends Request {
  user?: {
    _id: string;
  };
}

export interface IError extends Error {
  statusCode: number;
}