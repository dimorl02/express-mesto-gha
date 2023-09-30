const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth  = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.use('/signin', validateLogin, login);
app.use('/signup', validateCreateUser, createUser);


app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Данный путь не найден'));
});

app.listen(PORT);
