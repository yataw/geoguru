const config = require('../../config');
const log = require('../../libs/logger')(module)

class Summary {
    /**
     * @param emitter
     */
    constructor(emitter) {
        this.conf = config.get('earthConsts')
        /**
         * @type {Object<SocketId, Score>}
         */
        this.score = {}
        /**
         * @type {Object<SocketId, Summary.Vote>}
         */
        this.lastVotes = {}

        emitter.on(config.get('events').START, this.clear.bind(this))
        emitter.on(config.get('events').END, data => {
            this.upd(data.verboseAnswer)

            /**
             * Этот листенер должен выполниться до отправки результата клиентам
             * Мутируем состояние объекта, сопутствующего событию MatchRepeater.Events.END
             *
             * @type {MatchRepeater.EventEndData}
             */
            let mutableResult = Object.assign(data, this.get())
        })
    }

    upd(verboseAnswer) {
        Object.keys(this.lastVotes).forEach(id => {
            const vote = this.lastVotes[id]

            if (!vote)
                return

            const answer = verboseAnswer.answer;
            const R = this.conf.radius;
            const maxDist = this.conf.maxDist;
            const lat1 = vote[0] / 360 * 2 * Math.PI;
            const lat2 = answer[0] / 360 * 2 * Math.PI;
            const lng1 = vote[1] / 360 * 2 * Math.PI;
            const lng2 = answer[1] / 360 * 2 * Math.PI;

            const cosX = Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng1 - lng2);
            const dist = Math.round(R*Math.acos(cosX));
            // magic function
            const score = +(Math.pow((maxDist - dist) / maxDist, 3) * 10);

            this.score[id].add(score, dist)
        })
    }

    /**
     * Добавить голос
     */
    add(id, vote) {
        this.lastVotes[id] = vote
    }

    addPlayer(id) {
        this.score[id] = new Score();
    }

    erase(id) {
        delete this.score[id]
        delete this.lastVotes[id]
    }

    clear() {
        Object.keys(this.score).forEach(id => {
            this.score[id].clear();
            this.lastVotes[id] = null;
        })
    }

    get() {
        return {score: this.score, lastVotes: this.lastVotes}
    }
}

/**
 * lat и lng
 *
 * @typeof {Array<number>}
 */
Summary.Vote;

class Score {
    constructor() {
        /**
         * dist - разница между правильным ответом и ответом пользователя в км.
         *
         * @type {{dist: ?number, score: number}}
         */
        this.last = {dist: null, score: 0};

        /** @type {{score: number}}*/
        this.total = {score: 0};
    }

    add(score, dist) {
        this.last = {dist, score};
        this.total.score += score;
    }

    clear() {
        this.last = {dist: null, score: 0};
    }
}



module.exports = Summary