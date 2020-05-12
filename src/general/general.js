const Events = {
    // системные
    connection: 'connection',
    reconnecting: 'reconnecting',
    disconnect: 'disconnect',

    // кастомные
    setname: 'setname',
    getplayers: 'getplayers',
    signin: 'signin',
    signout: 'signout',
    taskstart: 'taskstart',
    taskend: 'taskend',
    vote: 'vote',
    chat_message: 'chatmessage'
};

const GameParameters = {
    tasksInSet: 10,
    phasesDuration: {
        active: 10000,
        passive: 5000
    }
};

const EarthConsts = {
    lat: {
        min: -90,
        max: -90
    },
    lng: {
        min: -180,
        max: 180
    },
    radius: 6371,
    maxDist: 20015.086
};

export {
    Events,
    GameParameters,
    EarthConsts
};