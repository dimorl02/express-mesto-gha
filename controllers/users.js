const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const user = User.findUserByCredentials(email, password);
  if (!user) {
    throw new NotFoundError('Пользователь не найден');
  }
  const hasRightPassword = bcrypt.compare(password, user.password);
  if (!hasRightPassword) {
    throw new UnauthorizedError('Ошибка авторизации');
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
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
}


module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() =>  new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданные данные некорректны');
      } else if (err.message === 'NotFoundError') {
        throw new NotFoundError('Пользователь не найден')
    .then((user) => res.send(user))
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
    throw new ValidationError('Переданные данные некорректны');
  }
  if (!about) {
    throw new ValidationError('Переданные данные некорректны');
  }
  if (!avatar) {
    throw new ValidationError('Переданные данные некорректны');
  }
  if (!email) {
    throw new ValidationError('Переданные данные некорректны');
  }
  if (!password) {
    throw new ValidationError('Переданные данные некорректны');
  }
  User.create({ email, password: passwordHash, name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданные данные некорректны');
      }
      if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      else {
        res
          .status(500)
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданные данные некорректны');
      } else if (err.message === 'NotFoundError') {
        throw new ValidationError('Пользователь не найден');
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
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданные данные некорректны');
      } else if (err.message === 'NotFoundError') {
        throw new ValidationError('Пользователь не найден');
      } else {
        res
          .status(500)
          .send({ message: `Внутренняя ошибка сервера: ${err.message} ` });
      }
    });
};
