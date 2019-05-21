const cookie = require('cookie');
const config = require('../config');
const MatchRepeater = require('./matchrepeater')
const HttpError = require('../error').HttpError;
const log = require('../libs/logger')(module);

class SocketController {
    constructor(server, log) {
        this.io = require('socket.io')(server, {logger: log});
        this.io.set('origins', '*:*');

        this.matchRepeater = new MatchRepeater();
        this.matchRepeater.start();

        this.init();
    }

    init() {
        const Events = config.get('events')

        this.io.on(Events.CONNECTION, socket => {
            const id = socket.id

            socket.on(Events.SIGNIN, player => {
                this.matchRepeater.addPlayer(id, player)
            })

            socket.on(Events.VOTE, data => {
                this.matchRepeater.addVote(id, data.latLng)
            });

            socket.on(Events.DISCONNECT, () => {
                this.matchRepeater.erasePlayer(id);
            });

            this.matchRepeater.subscribe(Events.START, task => {
                socket.emit(Events.START, task)
            });

            this.matchRepeater.subscribe(Events.END, data => {
                socket.emit(Events.END, data)
            });
        })
    }

    getIO() {
        return this.io
    }
}


module.exports = function (server, log) {
    const controller = new SocketController(server, log);

    return controller.getIO()
};
