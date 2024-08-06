import type { Request, Response } from 'express';

import Card from '../models/card';

import { USER_ID } from '../constants';

export const getCards = (request: Request, response: Response) => {
  Card.find({}).then((cards) => response.send({ data: cards }));
};

export const createCard = (request: Request, response: Response) => {
  const { name, link } = request.body;

  Card.create({ name, link, owner: USER_ID })
    .then((card) => response.send({ data: card }))
    .catch((err) => response.status(400).send(err));
};

export const deleteCardById = (request: Request, response: Response) => {
  Card.deleteOne({ _id: request.params.cardId })
    .then((card) => response.send({ data: card }))
    .catch((err) => response.status(400).send(err));
};

export const setCardLike = (request: Request, response: Response) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $addToSet: { likes: USER_ID } },
    { new: true }
  )
    .then((card) => response.send(card))
    .catch((err) => response.status(400).send(err));
};

export const removeLikeCard = (request: Request, response: Response) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $pull: { likes: USER_ID } },
    { new: true }
  )
    .then((card) => response.send(card))
    .catch((err) => response.status(400).send(err));
};
