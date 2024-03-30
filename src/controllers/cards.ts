import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Card from "../models/cards";
import { IRequest } from "../types/types";
import {
  CREATED_SUCCESS,
  DATA_NOT_FOUND,
  FORBIDDEN_ACTION,
  REQUEST_SUCCESS,
  SERVER_ERROR,
  VALIDATION_ERROR,
} from "../types/status";
import validationError from "../errors/ValidationError";
import notFoundError from "../errors/NotFoundError";
import forbiddenError from "../errors/ForbiddenError";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({}).populate(["owner", "likes"]);
    return res.status(REQUEST_SUCCESS).send(cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user?._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    return res.status(CREATED_SUCCESS).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error && error.name === "ValidationError") {
      return next(
        new validationError(
          "Переданы некорректные данные при создании карточки"
        )
      );
    }
    next(error);
  }
};

export const deleteCardById = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const ownerId = req.user!._id;
  Card.findById(req.params.cardId)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        return next(new notFoundError("Карточка с указанным _id не найдена."));
      }
      if (String(cardToDelete.owner) !== ownerId) {
        return next(
          new forbiddenError("Вы не можете этого сделать, вы не владелец")
        );
      }
      cardToDelete
        .remove()
        .then(() => res.status(REQUEST_SUCCESS).send(cardToDelete))
        .catch((err) => next(err));
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(
          new validationError(
            "Переданы некорректные данные при удалении карточки"
          )
        );
      }
      next(error);
    });
};

export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: ownerId } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        return next(new notFoundError("Карточка с указанным _id не найдена."));
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(
          new validationError("Переданы некорректные данные о лайках карточки")
        );
      }
      next(error);
    });
};

export const dislikeCard = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: ownerId } },
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена" });
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(
          new validationError("Переданы некорректные данные о лайках карточки")
        );
      }
      next(error);
    });
};
