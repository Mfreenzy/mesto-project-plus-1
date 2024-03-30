import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import { IRequest } from "../types/types";
import {
  CREATED_SUCCESS,
  REQUEST_SUCCESS,
} from "../types/status";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import notFoundError from "../errors/NotFoundError";
import validationError from "../errors/ValidationError";
import conflictError from "../errors/ConflictError";
import unauthorizedError from "../errors/UnauthorizedError";

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);

export const findUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        return next(
          new notFoundError("Пользователь по указанному _id не найден")
        );
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(
          new validationError(
            "Переданы некорректные данные для поиска пользователя"
          )
        );
      }
      next(error);
    });
};

export const findCurrentUserById = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.user!._id)
    .then((user) => {
      if (!user) {
        return next(
          new notFoundError("Пользователь по указанному _id не найден")
        );
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(
          new validationError(
            "Переданы некорректные данные для поиска пользователя"
          )
        );
      }
      next(error);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash: number | string) =>
      User.create({ email, password: hash, name, about, avatar })
    )
    .then((user) =>
      res.status(CREATED_SUCCESS).send({ id: user._id, email: user.email })
    )
    .catch((error) => {
      if (error.code === 11000) {
        return next(new conflictError("Данный e-mail уже используется"));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(
          new validationError(
            "Переданы некорректные данные при создании профиля"
          )
        );
      }
      next(error);
    });
};

export const updateUser = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(
          new notFoundError("Пользователь по указанному _id не найден")
        );
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === "ValidationError") {
        return next(
          new validationError(
            "Переданы некорректные данные при обновлении профиля"
          )
        );
      }
      next(error);
    });
};

export const updateAvatar = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(
          new notFoundError("Пользователь по указанному _id не найден")
        );
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === "ValidationError") {
        return next(
          new validationError(
            "Переданы некорректные данные при обновлении аватара"
          )
        );
      }
      next(error);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Найти пользователя по введенной почте
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return next(new unauthorizedError("Неправильная почта или пароль"));
      }

      // Проверить пароль
      if (user.password !== password) {
        return next(new unauthorizedError("Неправильный пароль"));
      }

      // Если почта и пароль верные, создать JWT токен
      const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "7d" });

      // Отправить JWT токен клиенту
      res.cookie("jwt", token, { httpOnly: true });

      // Ответ об успешной авторизации
      return res
        .status(REQUEST_SUCCESS)
        .json({ message: "Вы успешно вошли в систему" });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
};
