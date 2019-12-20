const capitals = require('../data/capitals');
const length = capitals.length;

class Task {
    constructor(taskNumber, maxTasks) {
        const n = Math.floor(Math.random() * length);
        let {id, city, lat, lng, country, population} = capitals[n];

        this.task = {id, city, country, taskNumber, maxTasks};
        this.answer = {...this.task, lat, lng, population};
    }

    get() {
        return this.task;
    }

    getAnswer() {
        return this.answer;
    }
}

module.exports = Task;