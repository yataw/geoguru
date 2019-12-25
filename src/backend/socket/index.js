// const HttpError = require('../error').HttpError;
// const log = require('../logger')(module);

import {Events} from '../../general/general';
import Game from '../../game/game';

module.exports = function (server, log) {
    const io = require('socket.io')(server, {logger: log});
    const game = new Game();

    io.set('origins', '*:*');
    io.on(Events.connection, socket => {
        // TODO authorization

        socket.on(Events.setname, ({name}) => {
            const color = '000';

            game.addPlayer({id: socket.id, socket, name, color});

            socket.on(Events.chat_message, text => {
                const id = Math.random();

                socket.broadcast.emit(Events.chat_message, {id, text, author: name, me: false});
                socket.emit(Events.chat_message, {id, text, author: name, me: true});
            })
        })
    });

    return io;
};
