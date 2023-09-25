const express = require('express');

const {
  login,
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUserAvatar,
  updateUserProfile,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getUsers);
users.get('/me', getCurrentUser);
users.get('/:userId', getUser);
users.patch('/:userId', updateUserAvatar);
users.patch('/:userId', updateUserProfile);

module.exports = users;
