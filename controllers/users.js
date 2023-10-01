const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const InternalError = require('../errors/InternalError');
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
      throw new InternalError('Внутренняя ошибка сервера');
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => next(err));
};


module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() =>  new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданные данные некорректны'));
      } else if (err.message === 'NotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashPassword) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы данные некорректны'));
      } else if (err.code === 409) {
        next(new ConflictError('Пользователь с таким e-mail уже зарегистрирован'));
      } else { next(err); }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданные данные некорректны'));
      } else if (err.message === 'NotFoundError') {
        next(new ValidationError('Пользователь не найден'));
      } else {
        next(new InternalError('Внутренняя ошибка сервера'));
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
        next(new ValidationError('Переданные данные некорректны'));
      } else if (err.message === 'NotFoundError') {
        next(new ValidationError('Пользователь не найден'));
      } else {
        next(new InternalError('Внутренняя ошибка сервера'));
      }
    });
};
