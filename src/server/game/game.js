const log = require('../logger')(module);
const config = require('../config');
const Events = config.get('events');
const GameParameters = config.get('gameParameters');
const Player = require('./player');
const Task = require('./task');
const Vote = require('./vote');
const random = require('random')

const botsData = require('./botsdata.json');

const MAX_TASKS = GameParameters.tasksInSet;
const ACTIVE_DURATION = GameParameters.phasesDuration.active;
const PASSIVE_DURATION = GameParameters.phasesDuration.passive;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

class Game {
    constructor() {
        /**
         * @type {{socketId: Player}}
         */
        this.players = {};
        this.taskNumber = 1;
        this.task = null;
        /**
         * @type {{socketId: Vote}}
         */
        this.votes = {};
        this.state = this.states.PASSIVE_PHASE;
        this.bots = this.generateBots();
        this.taskStart();
    }

    // TODO refactor это должно быть не здесь
    generateBots() {
        const data = shuffle([...botsData]);
        const strong = data.find(value => value.sigma < 3);
        const weak = data.find(value => value.sigma > 25);
        const mids = [];

        data.forEach(el => {
            if (mids.length > 3)
                return;

            if (el.sigma > 15 && el.sigma < 20)
                mids.push(el);
        });

        const bots = [strong, ...mids, weak];

        bots.forEach(el => el.color = el.color.toString(16));

        return bots;
    }

    calculateBotsVotes() {
        this.bots.forEach(bot => {
            const answer = this.task.getAnswer();

            const sigma = bot.sigma;

            const lat = random.normal(answer.lat, sigma)();
            const lng = random.normal(answer.lng, sigma)();

            this.addVote(bot, {lat, lng});
        })
    }

    addPlayer(playerInfo) {
        const {socket, id} = playerInfo;

        this.players[id] = new Player(playerInfo);

        const player = this.players[id];

        socket.on(Events.VOTE, vote => {
            if (player.inGame && this.state === this.states.ACTIVE_PHASE)
                this.addVote(player, vote)
        });

        socket.on(Events.DISCONNECT, () => {
            socket.broadcast.emit(Events.SIGNOUT, id);
            delete this.players[id];
        });
    };

    addVote(player, vote) {
        const id = player.id;
        this.votes[id] = new Vote({id, vote, answer: this.task.getAnswer()});
    };

    taskStart() {
        this.state = this.states.ACTIVE_PHASE;
        this.addPlayersToGame();
        this.task = new Task(this.taskNumber, MAX_TASKS);
        this.taskNumber++;
        this.calculateBotsVotes();

        this.forEach(({socket}) => socket.emit(Events.TASKSTART, this.task.get()));
        setTimeout(this.taskEnd.bind(this), ACTIVE_DURATION);
    };

    getAllPlayers() {
        const players = {};

        this.bots.forEach(bot => (players[bot.id] = bot));
        Object.values(this.players).forEach(player => {
            const copiedPlayer = players[player.id] = {};

            Object.keys(player).filter(prop => prop !== 'socket').forEach(prop => {
                copiedPlayer[prop]  = player[prop];
            })
        });

        return players;
    }

    taskEnd() {
        this.state = this.states.PASSIVE_PHASE;
        this.updateScore();
        this.forEach(({socket}) => socket.emit(Events.TASKEND, {answer: this.task.getAnswer(), votes: this.votes, players: this.getAllPlayers()}));

        this.votes = {};

        if (this.taskNumber > MAX_TASKS) {
            this.taskNumber = 1;
            this.clearScore();
        }

        setTimeout(this.taskStart.bind(this), PASSIVE_DURATION);
    };

    updateScore() {
        this.forEach(player => {
            const id = player.id;
            const vote = this.votes[id];
            const score = vote ? vote.score : 0;

            player.score += score;
        });

        this.bots.forEach(bot => {
            const id = bot.id;
            const vote = this.votes[id];
            const score = vote ? vote.score : 0;

            bot.score += score;
        })
    };

    clearScore() {
        this.forEach(player => {player.score = 0});
        this.bots.forEach(bot => {bot.score = 0});
    };

    addPlayersToGame() {
        this.forEach(player => {player.inGame = true}, ({inGame}) => !inGame);
    };
    
    forEach(callback, filter = () => true) {
        Object.values(this.players).filter(filter).forEach(callback);
    };
}

Game.prototype.states = {
    ACTIVE_PHASE: 0,
    PASSIVE_PHASE: 1
};

module.exports = Game;