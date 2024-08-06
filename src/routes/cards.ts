import { Router } from 'express';

import { createCard, deleteCardById, getCards } from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardById);

export default cardRouter;
