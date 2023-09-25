const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { auth } = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');
const errorRouter = (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый маршрут не найден' })
}

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('/*', errorRouter);
module.exports = router;
