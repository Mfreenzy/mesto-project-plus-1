import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user";
import { IRequest } from "../types/types";
import {
  CREATED_SUCCESS,
  DATA_NOT_FOUND,
  REQUEST_SUCCESS,
  SERVER_ERROR,
  VALIDATION_ERROR,
  UNAUTHORIZED,
} from "../types/status";
import jwt from "jsonwebtoken";

export const getUsers = (req: Request, res: Response) =>
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(SERVER_ERROR).send({ message: "На сервере произошла ошибка" })
    );

export const findUserById = (req: Request, res: Response) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(VALIDATION_ERROR).send({
          message: "Переданы некорректные данные для поиска пользователя",
        });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_SUCCESS).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({
          message: "Переданы некорректные данные при создании профиля",
        });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

export const updateUser = (req: IRequest, res: Response) => {
  const { name, about } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

export const updateAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  const currentUser = req.user?._id;
  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error && error.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "На сервере произошла ошибка" });
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Найти пользователя по введенной почте
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED)
          .json({ message: "Неправильная почта или пароль" });
      }

      // Проверить пароль
      if (user.password !== password) {
        return res
          .status(UNAUTHORIZED)
          .json({ message: "Неправильная почта или пароль" });
      }

      // Если почта и пароль верные, создать JWT токен
      const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "7d" });

      // Отправить JWT токен клиенту
      res.cookie("jwt", token, { httpOnly: true });

      // Ответ об успешной авторизации
      return res.status(REQUEST_SUCCESS).json({ message: "Вы успешно вошли в систему" });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(SERVER_ERROR)
        .json({ message: "Произошла ошибка при попытке входа" });
    });
};
