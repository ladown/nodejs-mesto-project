import type { Request, Response } from 'express';

import Card from '../models/card';

export const getCards = (request: Request, response: Response) => {
  Card.find({}).then((cards) => response.send({ data: cards }));
};

export const createCard = (request: Request, response: Response) => {
  const { name, link } = request.body;

  Card.create({ name, link, owner: '66b20d3ec49fa47fed50006b' })
    .then((card) => response.send({ data: card }))
    .catch((err) => response.status(400).send(err));
};

export const deleteCardById = (request: Request, response: Response) => {
  const { cardId } = request.params;

  if (cardId) {
    Card.deleteOne({ _id: cardId })
      .then((card) => response.send({ data: card }))
      .catch((err) => response.status(400).send(err));
  }
};
