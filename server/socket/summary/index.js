const config = require('../../config');

class Summary {
    /**
     * @param emitter
     */
    constructor(emitter) {
        /**
         * @type {Object<SocketId, CurrentMatchResult>}
         */
        this.current = {}

        /**
         * @type {Object<SocketId, Score>}
         */
        this.total = {}
        this.conf = config.get('earthConsts')

        emitter.on(config.get('events').START, this.clear.bind(this))
        emitter.on(config.get('events').END, data => {
            this.upd(data.verboseAnswer)

            /**
             * Этот листенер должен выполниться до отправки результата клиентам
             * Мутируем состояние объекта, сопутствующего событию MatchRepeater.Events.END
             *
             * @type {MatchRepeater.EventEndData}
             */
            let mutableResult = Object.assign(data, {current: this.current}, {total: this.total})
        })
    }

    upd(verboseAnswer) {
        Object.keys(this.current).forEach(id => {
            const vote = this.current[id].vote;
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
            const score = +(Math.pow((maxDist - dist) / maxDist, 3) * 10).toFixed(2);

            this.current[id] = new CurrentMatchResult({vote, dist, score})

            if (this.total[id])
                this.total[id].add(score)
            else
                this.total[id] = new Score(score)
        })
    }

    add(id, vote) {
        this.current[id] = new CurrentMatchResult({vote})
    }

    erase(id) {
        delete this.current[id]
        delete this.total[id]
    }

    clear() {
        Object.keys(this.current).forEach(socketId => {
            this.current[socketId] = {...this.current[socketId], vote: [0, 0]}
        })
    }

    get() {
        return {current: this.current, total: this.total}
    }
}

/**
 * dist и score вычисляются в upd
 */
class CurrentMatchResult {
    constructor({vote, dist, score}) {
        this.vote = vote;
        this.dist = dist;
        this.score = score;
    }
}

class Score {
    constructor(score) {
        this.score = score;
    }

    add(score) {
        this.score += score;
    }
}

module.exports = Summary