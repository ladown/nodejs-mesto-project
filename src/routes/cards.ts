import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';

import {
  createCard,
  deleteCardById,
  getCards,
  removeLikeCard,
  setCardLike,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
  }),
  createCard,
);
cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteCardById,
);
cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  setCardLike,
);
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  removeLikeCard,
);

export default cardRouter;
