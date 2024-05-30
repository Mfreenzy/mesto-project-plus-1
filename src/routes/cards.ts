import { Router } from "express";
import {
  createCard,
  deleteCardById,
  dislikeCard,
  getCards,
  likeCard,
} from "../controllers/cards";
import { validateCreateCard, validateCardId } from "../validator/validator";

const router = Router();
router.get("/", getCards);
router.delete("/:cardId", validateCardId, deleteCardById);
router.post("/", validateCreateCard, createCard);
router.put("/:cardId/likes", validateCardId, likeCard);
router.delete("/:CardId/likes", validateCardId, dislikeCard);

export default router;
