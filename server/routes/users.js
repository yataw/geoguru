const log = require('../libs/logger')(module);
const User = require('../models/user').User;
const HttpError = require('../error').HttpError;
const AuthError = require('../models/user').AuthError;
const async = require('async');
const users = {};

users.get = (req, res, next) => {
  res.render('login', {});
};

users.post = (req, res, next) => {
  const {name: username, password} = req.body;

  User.authorize(username, password, (err, user) => {
    if (err)  {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
        return next(err);
      }
    }

    req.session.user = user._id;
    res.send({});
  })

};

module.exports = users;
