function getDistInKm(pointA, pointB) {
    const R = 6371;
    const lat1 = pointA.latLng[0] / 360 * 2 * Math.PI;
    const lat2 = pointB.latLng[0] / 360 * 2 * Math.PI;
    const lng1 = pointA.latLng[1] / 360 * 2 * Math.PI;
    const lng2 = pointB.latLng[1] / 360 * 2 * Math.PI;

    const cosX = Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng1 - lng2);

    if (cosX > 1 || cosX < -1)
        throw new Error('Invalid calculation');

    return R*Math.acos(cosX);
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

export {getDistInKm, getRandomColor};