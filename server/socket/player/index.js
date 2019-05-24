const config = require('../../config')
const log = require('../../libs/logger')(module)

class Player {
    // объект с клиента
    constructor(player) {
        this.name = player.name;
        this.avatar = null;
    }

    getName() {
        return this.name
    }
}

module.exports = Player