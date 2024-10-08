import type { NextFunction, Request, Response } from 'express';

import Card from '../models/card';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/index';

import type { ISessionRequest } from '../types/index';

export const getCards = (_: Request, response: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      response.send(cards);
    })
    .catch(next);
};

export const createCard = (request: ISessionRequest, response: Response, next: NextFunction) => {
  const { name, link } = request.body;
  const requestUser = request.user;
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  if (!userId) {
    next(new UnauthorizedError());
  }

  Card.create({ name, link, owner: userId })
    .then((card) => {
      response.status(201).send(card);
    })
    .catch(next);
};

export const deleteCardById = (
  request: ISessionRequest,
  response: Response,
  next: NextFunction,
) => {
  const requestUser = request.user;
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  if (!userId) {
    next(new UnauthorizedError());
  }

  Card.findById(request.params.cardId)
    .then((card) => {
      if (card?.owner.toString() !== userId) {
        throw new ForbiddenError('Вы пытаетесь удалить чужую карточку');
      }
    })
    .then(() => {
      Card.deleteOne({ _id: request.params.cardId }).then((card) => {
        if (card.deletedCount === 0) {
          throw new NotFoundError('Карточка с указанным _id не найдена.');
        } else {
          response.send({ message: 'Пост удалён' });
        }
      });
    })
    .catch((error) => {
      const errorToThrow =
        error.name === 'CastError'
          ? new BadRequestError('Передан некорректный _id карточки.')
          : error;

      next(errorToThrow);
    });
};

export const setCardLike = (request: ISessionRequest, response: Response, next: NextFunction) => {
  const requestUser = request.user;
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  if (!userId) {
    next(new UnauthorizedError());
  }

  Card.findByIdAndUpdate(request.params.cardId, { $addToSet: { likes: userId } }, { new: true })
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

export const removeLikeCard = (
  request: ISessionRequest,
  response: Response,
  next: NextFunction,
) => {
  const requestUser = request.user;
  const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

  if (!userId) {
    next(new UnauthorizedError());
  }

  Card.findByIdAndUpdate(request.params.cardId, { $pull: { likes: userId } }, { new: true })
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
