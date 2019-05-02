const log = require('../libs/logger')(module);

module.exports = (req, res, next) => {
  const sid = req.session.id;
  const io = req.app.locals.io;
  const sockets = io.sockets.sockets;

  req.session.destroy(err => {
    for (let i in sockets)
    {
      if (sockets[i].handshake.session.id === sid)
      {
        sockets[i].disconnect();
      }
    }

    if(err)
      next(err);
  });

  res.status(302);
  res.end();
};