import type { NextFunction, Request, Response } from 'express';

import Card from '../models/card';
import { BadRequestError, NotFoundError } from '../errors/index';
import { USER_ID } from '../constants';

export const getCards = (_: Request, response: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      response.send({ data: cards });
    })
    .catch((error) => {
      next(error);
    });
};

export const createCard = (request: Request, response: Response, next: NextFunction) => {
  const { name, link } = request.body;

  Card.create({ name, link, owner: USER_ID })
    .then((card) => {
      response.send({ data: card });
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'ValidationError'
          ? new BadRequestError('Переданы некорректные данные при создании карточки.')
          : error;

      next(errorToThrow);
    });
};

export const deleteCardById = (request: Request, response: Response, next: NextFunction) => {
  Card.deleteOne({ _id: request.params.cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else {
        response.send({ data: card });
      }
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'CastError'
          ? new BadRequestError('Передан некорректный _id карточки.')
          : error;

      next(errorToThrow);
    });
};

export const setCardLike = (request: Request, response: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(request.params.cardId, { $addToSet: { likes: USER_ID } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      } else {
        response.send(card);
      }
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'CastError'
          ? new BadRequestError(
              'Переданы некорректные данные для постановки/снятия лайка или некорректный _id карточки.',
            )
          : error;

      next(errorToThrow);
    });
};

export const removeLikeCard = (request: Request, response: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(request.params.cardId, { $pull: { likes: USER_ID } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      } else {
        response.send(card);
      }
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'CastError'
          ? new BadRequestError(
              'Переданы некорректные данные для постановки/снятия лайка или некорректный _id карточки.',
            )
          : error;

      next(errorToThrow);
    });
};
