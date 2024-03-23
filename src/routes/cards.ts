import { Router } from 'express';
import { createCard, deleteCardById, getCards } from '../controllers/cards';

const router = Router();
router.delete('/:cardId', deleteCardById);
router.get('/', getCards);
router.post('/', createCard);

export default router;