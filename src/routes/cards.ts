import { Router } from 'express';

import {
  createCard,
  deleteCardById,
  getCards,
  removeLikeCard,
  setCardLike,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.put('/:cardId/likes', setCardLike);
cardRouter.delete('/:cardId/likes', removeLikeCard);

export default cardRouter;
