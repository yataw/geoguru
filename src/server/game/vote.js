const config = require('../config').get('earthConsts');

const R = config.radius;
const maxDist = config.maxDist;

class Vote {
    constructor({id, vote, answer}) {
        const lat1 = vote.lat / 360 * 2 * Math.PI;
        const lat2 = answer.lat / 360 * 2 * Math.PI;
        const lng1 = vote.lng / 360 * 2 * Math.PI;
        const lng2 = answer.lng / 360 * 2 * Math.PI;

        const cosX = Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng1 - lng2);
        const dist = Math.round(R*Math.acos(cosX));
        // magic function
        const score = +(Math.pow((maxDist - dist) / maxDist, 3) * 10);

        this.id = id;
        this.score = score;
        this.lat = vote.lat;
        this.lng = vote.lng;
    }
}

module.exports = Vote;