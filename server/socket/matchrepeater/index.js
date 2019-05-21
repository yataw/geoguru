const EventEmitter = require('events')
const config = require('../../config')
const log = require('../../libs/logger')(module)
const capitals = require('../../data/capitals')
const Summary = require('../summary')
const Player = require('../player')

class MatchRepeater {
    constructor() {
        this.emitter = new EventEmitter();
        this.timeConf = config.get('matchIntervals')
        this.eartchConf = config.get('earthConsts')

        /**
         * @type {Object<SocketId, Player>}
         */
        this.players = {};
        /**
         * @type {Object<SocketId, Player>}
         */
        this.waiting_players = {};
        this.state = MatchRepeater.State.STOPPED;
        /**
         * @type {Task}
         */
        this.task = null;

        /**
         * @type {Object<SocketId, Coords>}
         */
        this.summary = new Summary(this.emitter);
    }

    exec_() {
        if (this.state !== MatchRepeater.State.RUN)
            return;

        this.generateNewTask()

        /** @type {MatchRepeater.EventStartData} */
        let startAttached = {task: this.task.get()}

        this.emitter.emit(config.get('events').START, startAttached)

        setTimeout(() => {
            this.emitter.emit(config.get('events').END, {verboseAnswer: this.task.getVerboseAnswer()})

            setTimeout(this.exec_.bind(this), this.timeConf.pause)
        }, this.timeConf.duration)
    }

    addPlayer(id, player) {
        const newcomer = new Player(player);

        if (this.state === MatchRepeater.State.RUN) {
            this.waiting_players[id] = newcomer;
        } else {
            this.players[id] = newcomer;
        }

        socket.broadcast.emit(config.get('events').JOIN, newcomer.getName());
        log.info('add player ', newcomer.getName());
    }

    erasePlayer(id) {
        this.summary.erase(id);
        delete this.players[id];
    }

    generateNewTask() {
        this.task = new Task();
    }

    start() {
        this.state = MatchRepeater.State.RUN
        this.exec_()
    }

    stop() {
        this.state = MatchRepeater.State.STOPPED
    }

    subscribe(eventType, callback) {
        this.emitter.on(eventType, callback);
    }

    unSubscribe(eventType, callback) {
        this.emitter.off(eventType, callback);
    }

    addVote(socketId, vote) {
        this.summary.add(socketId, vote)
    }
}

MatchRepeater.State = {
    RUN: 'run',
    STOPPED: 'stopped',
}

class UserResult {
    constructor({vote, dist, score}) {
        this.vote = vote;
        this.dist = dist;
        this.score = score;
    }
}

class Task {
    constructor() {
        const length = capitals.length;
        const n = Math.floor(Math.random() * length);
        const city = capitals[n];

        this.task = new OuterTask(city.country, city.city_ascii);
        this.info = {...this.task, pupulation: city.population};
        /**
         * @type {Coords}
         */
        this.answer = [city.lat, city.lng];
    }

    get() {
        return this.task;
    }

    getVerboseAnswer() {
        return new VerboseAnswer(this.answer, this.info);
    }

    /**
     * @returns {Coords}
     */
    getAnswer() {
        return this.answer;
    }
}

class OuterTask {
    constructor(country, city) {
        this.country = country;
        this.city = city;
    }
}

class VerboseAnswer {
    constructor(answer, info) {
        /**
         * @type {Coords}
         */
        this.answer = answer;
        /**
         * @type {{coutry: string, city: string, population: number}}
         */
        this.info = info;
    }
}


/**
 * Пара координат lat и lng
 * 
 * @typedef {Array<number>}
 */
var Coords;

/**
 * @typedef {string}
 */
var SocketId;

/**
 * @typedef {{task: OuterTask}}
 */
MatchRepeater.EventEndData;

/**
 * @typedef {{verboseAnswer: VerboseAnswer, current: Object<SocketId, CurrentMatchResult>, total: Object<SocketId, Score>}}
 */
MatchRepeater.EventStartData;

module.exports = MatchRepeater;