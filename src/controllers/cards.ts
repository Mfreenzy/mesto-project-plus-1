import mongoose from "mongoose";
import { Request, Response } from "express";
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

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({}).populate('owner');
    return res.status(REQUEST_SUCCESS).send(cards);
  } catch (error) {
    return res.status(SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
};

export const createCard = async (req: IRequest, res: Response) => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user?._id;
    const newCard = await Card.create({ name, link, owner: ownerId });
    return res.status(CREATED_SUCCESS).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error && error.name === 'ValidationError') {
      return res
        .status(VALIDATION_ERROR)
        .send({ message: 'Data is incorrect' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
};

export const deleteCardById = async (req: IRequest, res: Response) => {
  try {
    const ownerId = req.user!._id;
    const cardToDelete = await Card.findByIdAndRemove(req.params.cardId);
    if (!cardToDelete) {
      return res
        .status(DATA_NOT_FOUND)
        .send({ message: 'Data does not exist' });
    }
    if (String(cardToDelete.owner) === ownerId) {
      return res.status(REQUEST_SUCCESS).send(cardToDelete);
    }
    return res
      .status(FORBIDDEN_ACTION)
      .send({ message: 'You are not an owner' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(VALIDATION_ERROR)
        .send({ message: 'Data is not correct' });
    }
    return res.status(SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
};

export const likeCard = (req: IRequest, res: Response) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'Card does not exist' });
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
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

export const dislikeCard = (req: IRequest, res: Response) => {
  const ownerId = req.user?._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res
          .status(DATA_NOT_FOUND)
          .send({ message: 'Card does not exist' });
      }
      return res.status(REQUEST_SUCCESS).send({ data: card });
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
