const EventEmitter = require('events');
const config = require('../../config');
const log = require('../../libs/logger')(module);
const capitals = require('../../data/capitals')


class MatchRepeater {
    constructor() {
        this.emitter = new EventEmitter();
        this.timeConf = config.get('matchIntervals')
        this.eartchConf = config.get('earthConsts')
        this.state = MatchRepeater.State.STOPPED;

        /**
         * @type {Object<SocketId, Coords>}
         */
        this.usersVotes = {};

        /**
         * 
         * @type {Object<SocketId, UserResult>}
         */
        this.usersResults = {};

        /**
         * @type {Task}
         */
        this.task = [0, 0];

        this.diff = 0;
    }

    exec_() {
        if (this.state !== MatchRepeater.State.RUN)
            return;

        setTimeout(() => {
            this.clearVotes()
            this.generateNewTask();
            this.emitter.emit(MatchRepeater.Events.START, this.task.get())

            setTimeout(() => {
                this.calculatePoints()
                this.emitter.emit(MatchRepeater.Events.END, this.usersResults, this.task.getAnswer(), this.task.getInfo())

                setTimeout(this.exec_.bind(this), this.timeConf.pause)
            }, this.timeConf.duration)
        });
    }
    
    calculatePoints() {
        Object.keys(this.usersVotes).forEach(socketId => {
            const vote = this.usersVotes[socketId];
            const answer = this.task.getAnswer();
            const R = this.eartchConf.radius;
            const maxDist = this.eartchConf.maxDist;
            const lat1 = vote[0] / 360 * 2 * Math.PI;
            const lat2 = answer[0] / 360 * 2 * Math.PI;
            const lng1 = vote[1] / 360 * 2 * Math.PI;
            const lng2 = answer[1] / 360 * 2 * Math.PI;

            const cosX = Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng1 - lng2);
            const dist = Math.round(R*Math.acos(cosX));
            // magic function
            const points = (Math.pow((maxDist - dist) / maxDist, 3) * 10).toFixed(2);

            this.usersResults[socketId] = new UserResult(dist, points)
        })
    }

    generateNewTask() {
        this.task = new Task();
    }

    clearVotes() {
        Object.keys(this.usersVotes).forEach(socketId => this.usersVotes[socketId]= [0, 0])
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
        this.usersVotes[socketId] = vote
    }
}

MatchRepeater.Events = {
    START: 'matchstart',
    END: 'matchend',
}

MatchRepeater.State = {
    RUN: 'run',
    STOPPED: 'stopped',
}

class UserResult {
    constructor(dist, points) {
        this.dist = dist;
        this.points = points;
    }
}

class Task {
    constructor() {
        const length = capitals.length;
        const n = Math.floor(Math.random() * length);
        const city = capitals[n];

        this.task = {country: city.country, city: city.city_ascii};
        this.info = {pupulation: city.population};
        /**
         * @type {Coords}
         */
        this.answer = [city.lat, city.lng];
    }

    get() {
        return new OuterTask(this.task)
    }

    getInfo() {
        return this.info;
    }

    getAnswer() {
        return this.answer;
    }
}

class OuterTask {
    constructor(task) {
        this.country = task.country;
        this.city = task.city;
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

module.exports = MatchRepeater;