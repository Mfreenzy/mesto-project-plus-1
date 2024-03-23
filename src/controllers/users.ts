import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { IRequest } from '../types/types';
import {
  CREATED_SUCCESS,
  DATA_NOT_FOUND,
  REQUEST_SUCCESS,
  SERVER_ERROR,
  VALIDATION_ERROR,
} from '../types/status';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'Internal Server Error' }));

export const findUserById = (req: Request, res: Response) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'User is not found' });
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: 'Data is not correct' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_SUCCESS).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === 'ValidationError') {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: 'Data is not correct' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};

export const updateUser = (req: IRequest, res: Response) => {
  const { name, about } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'User is not found' });
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === 'ValidationError') {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: 'Data is not correct' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};

export const updateAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'User is not found' });
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === 'ValidationError') {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: 'Data is not correct' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Internal Server Error' });
    });
};