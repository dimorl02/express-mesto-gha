const { Card } = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные');
      } else {
        res
          .status(500)
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {

      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Запрещено удалять чужую карточку');
      }
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.message === 'NotFoundError') {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res
          .status(500)
          .send({ message: `Внутренняяя ошибка сервера: ${err.message} ` });
      }
    })
    .catch((err) => {
      next(err);
    });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.message === 'NotFoundError') {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res
          .status(500)
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.message === 'NotFoundError') {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res
          .status(500)
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
}