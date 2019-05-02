const logger = require('morgan');
const errorHandler = require('errorhandler');
const HttpError = require('../error').HttpError;
const users = require('./users');
const chat = require('./chat');
const checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {
  app.route('/')
    .get((req, res, next) => {
      res.render('index', {});
    });

  app.route('/login')
    .get(users.get)
    .post(users.post);

  app.route('/chat')
    .get(checkAuth, chat.get)

  app.route('/logout')
    .post(require('./logout'));

  const User = require('../models/user').User;

  app.get('/users', (req, res, next) => {
    User.find({})
      .then(data => {
        res.json(data);
      })
      .catch(e => {
        next(e);
      });
  });

  app.get('/user/:id', (req, res, next) => {
    User.findById(req.params.id)
      .then(data => {
        res.json(data);
      })
      .catch(e => next(new HttpError(404, 'Пользователь не найден')))
  });

  app.use((req, res, next) => {
    next(404);
  });

  app.use((err, req, res, next) => {
    if (typeof err === 'number') {
      err = new HttpError(err);
    }

    if (err instanceof HttpError) {
      res.sendHttpError(err);
    } else {
      if (app.get('env') === 'development') {
        errorHandler()(err, req, res, next);
      } else {
        res.status(500);
      }
    }

  });


  if (app.get('env') === 'development') {
    app.use(logger('env'));
  } else {
    app.use(logger('default'));
  }
};
