const cookie = require('cookie');
const config = require('../config');
const EventEmitter = require('events');
// const cookieParser = require('cookie-parser');
// const sessionStore = require('../libs/sessionStore');
const HttpError = require('../error').HttpError;
const log = require('../libs/logger')(module);


module.exports = function (server, log) {
  const io = require('socket.io')(server, {logger : log});

/*  io.use((socket, next) => {
    socket.handshake.cookies = cookie.parse(socket.handshake.headers.cookie || '');

    const sidCookie = socket.handshake.cookies[config.get('session').key];
    const sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

    loadSession(sid, socket.handshake)
    // .then(loadUser)
    .then(() => next())
    .catch(e => next(e))
  });*/

/*    io.sockets.on('session:reload', sid =>
    {
      const clients = io.sockets.clients;

      clients.forEach(client => {
        log.warn(client);

        if (client.handshake.session.id !== sid)
          return;

        loadSession(sid)
            .then((err, session) => {
              if (err)
              {
                client.emit('error', 'server error');
                client.disconnect();

                return;
              }

              if (!session)
              {
                client.emit('error', 'handshake unauthorized');
                client.disconnect();

                return;
              }

              client.handshake.session = session;
            });
      });

    });*/
  const emitter = new EventEmitter();
  const timeConf = config.get('matchIntervals');
  const usersVotes = new Map();
  const points = new Map();
  let currentAnswer = [0, 0];
  let matchRepeatTimer = null;
  let diff = 0;

  function calculatePoints(vote, socket) {
    diff = 0;
    vote.forEach((val, key) => diff += Math.pow(val - currentAnswer[key], 2))
    diff = 2 - diff;
    points.set(socket, diff)
  }

  function matchRepeat() {
    emitter.emit('matchstart')
    setTimeout(() => {
      usersVotes.forEach(calculatePoints);
      emitter.emit('matchend')
      matchRepeatTimer = setTimeout(matchRepeat, timeConf.pause)
    }, timeConf.duration)
  }

  matchRepeat()

  io.on('connection', socket => { // socket - объект, связанный с данным конкретным клиентом
    // const username = socket.handshake.user.get('username');

    // socket.emit('userInfo', username);

    // socket.broadcast.emit('join', username);



    socket.on('vote', data => {
      log.info(data)

      usersVotes.set(socket, data.latLng);
    });

    emitter.on('matchstart', () => {
      socket.emit('matchstart', {})
    });

    emitter.on('matchend', () => {
      socket.emit('matchend', points.get(socket))
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