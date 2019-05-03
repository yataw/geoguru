const cookie = require('cookie');
const config = require('../config');
const MatchRepeater = require('./matchrepeater')
const HttpError = require('../error').HttpError;
const log = require('../libs/logger')(module);

module.exports = function (server, log) {
  const io = require('socket.io')(server, {logger : log});
  const matchRepeater = new MatchRepeater();

  matchRepeater.start()

  io.on('connection', socket => {
    socket.on('vote', data => {
      log.info(data)

      matchRepeater.addVote(socket.id, data.latLng)
    });

    matchRepeater.subscribe(MatchRepeater.Events.START, task => {
      socket.emit(MatchRepeater.Events.START, task)
    });

    matchRepeater.subscribe(MatchRepeater.Events.END, data => {
      socket.emit(MatchRepeater.Events.END, data)
    });

/*      socket.broadcast.emit('msg', {username, data});
      callback(true);
    });*/

/*    socket.on('disconnect', () => {
      socket.broadcast.emit('leave', username);
    });*/
  });

  // TODO set right origins
  io.set('origins', 'localhost:*');

  return io;
};