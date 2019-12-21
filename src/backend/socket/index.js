// const HttpError = require('../error').HttpError;
// const log = require('../logger')(module);

import general from '../../general';
import Game from '../../game/game';
const Events = general.events;

module.exports = function (server, log) {
    const io = require('socket.io')(server, {logger: log});
    const game = new Game();

    io.set('origins', '*:*');
    io.on(Events.CONNECTION, socket => {
        // TODO authorization

        socket.on(Events.SETNAME, ({name}) => {
            const color = '000';

            game.addPlayer({id: socket.id, socket, name, color});

            socket.on(Events.CHATMESSAGE, text => {
                const id = Math.random();

                socket.broadcast.emit(Events.CHATMESSAGE, {id, text, author: name, me: false});
                socket.emit(Events.CHATMESSAGE, {id, text, author: name, me: true});
            })
        })
    });

    return io;
};
