const { User } = require('../models/user');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = User.findUserByCredentials(email, password);
  if (!user) {
    throw new Error('Неверные данные для входа');
  }
  const hasRightPassword = bcrypt.compare(password, user.password);
  if (!hasRightPassword) {
    throw new Error('Неверные данные для входа');
  }
  const token = jwt.sign(
    {
      _id: user._id,
    },
    'super-strong-secret',
    {
      expiresIn: '7d',
    },
  );
  res.send({ jwt: token })
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
    const userId = req.user._id;
    const user = User.findById(userId);

    if (!user) {
      throw new Error('Пользователь не найден');
    }
    res.send(user);
}


module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('NotFoundError'))
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
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar, } = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  if (!name) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (!about) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (!avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (!email) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (!password) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  User.create({ email, password: passwordHash, name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res
          .status(500)
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFoundError'))
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
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFoundError'))
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
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};
