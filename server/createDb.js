const mongoose = require('./libs/mongoose');
const log = require('./libs/logger')(module);

/*

mongoose.connection.on('open', () => {})
  .then(db => db.dropDatabase())
  .then(() => {
    require('./models/user');

    return Promise.all(Object.values(mongoose.models).map(model => model.ensureIndexes()));
  })
  .then(() => {
    const users = [
      {username: 'Вася', password: 'supervasya'},
      {username: 'Петя', password: '123'},
      {username: 'admin', password: 'thetruehero'}
    ];

    return Promise.all(users.map(userData => {
      const user = new mongoose.models.User(userData);

      return user.save();
    }));
  })
  .then(() => log.info('SUCCESSFUL'))
  .catch(log.error)
  .finally(() => {
    mongoose.disconnect();
  });
*/

const E = require('./error').HttpError;

(function foo() {
  try {
    throw new E(405);
  } catch (e){
    log.info(e.stack)
  }
})()