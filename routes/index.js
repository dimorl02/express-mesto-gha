const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

const errorRouter = (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый маршрут не найден' })
}

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', errorRouter);

module.exports = router;
