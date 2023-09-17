const express = require('express');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');

const cards = express.Router();

cards.get('/', getCards);
cards.delete('/:cardId', deleteCard);
cards.post('/', createCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);

module.exports = cards;