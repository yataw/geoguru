
class Player {
    // TODO add avatar
    constructor({id, name, color, socket}) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.socket = socket;
        this.inGame = false;
        this.score = 0;
    }
}

module.exports = Player;