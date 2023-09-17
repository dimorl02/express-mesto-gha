const express = require('express');

const {
  getUsers,
  getUser,
  createUser,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getUsers);
users.get('/:userId', getUser);
users.post('/', createUser);
users.patch('/:userId', updateUserAvatar);
users.patch('/:userId', updateUserProfile);
module.exports = users;
