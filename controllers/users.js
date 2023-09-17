const { User } = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
        .status(400)
        .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(500)
          .send({ message: `Внутрення ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFoundError') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res
          .status(500)
          .send({ message: `Внутрення ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(500)
          .send({ message: `Внунтрення ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные',
          });
      } else if (err.message === 'NotFoundError') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res
          .status(500)
          .send({ message: `Внунтрення ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.message === 'NotFoundError') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res
          .status(500)
          .send({ message: `Внунтрення ошибка сервера: ${err.message} ` });
      }
    });
};
