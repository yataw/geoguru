import React, {PureComponent} from 'react'
import {render} from 'react-dom'
import './style.css'
import values from './values'
import {getDistInKm} from './utils'

class Visualization extends PureComponent {
    state = {
        id: '5477C51B-C46B-469E-A5F9-EE2A51A29DA5'
    }

    render() {
        const {width, height} = this.props;

        return (
                <div id='world-map' className={'mx-auto'} style={{width, height}}></div>
        )
    }

    componentDidMount() {
        // TODO revert log
        console.log('mounted in visualization')

        window.jQuery.noConflict();
        var $ = window.jQuery
        var socket = window.socket

        var map = new window.jvm.Map({
            container: $('#world-map'),
            map: 'world_mill_en',
            panOnDrag: true,
            focusOn: {
                x: 0.5,
                y: 0.5,
                scale: 2,
                animate: true
            },
/*            onMarkerTipShow: function(e, label, code){
                map.tip.text(markersCoords[code].lat.toFixed(2)+', '+markersCoords[code].lng.toFixed(2));
            },*/
            series: {
                regions: [{
                    scale: ['#C8EEFF', '#0071A4'],
                    normalizeFunction: 'polynomial',
                    values}]
            }
        });
        // debugger
        var markerIndex = 0,
            markersCoords = {};

        let r = 10;
        let N = 100;
        let offsetX = 39.86;
        let offsetY = -104.35;
        for (let n = 0; n < N; ++n) {
            map.addMarker(n, {latLng: [offsetX + r*Math.cos(2*Math.PI*n/N), offsetY + r*Math.sin(2*Math.PI*n/N)]});
        }

        map.addMarker(1000, {latLng: [55.7558, 37.6178]});

        map.container.click(function(e){
            var latLng = map.pointToLatLng(
                e.pageX - map.container.offset().left,
                e.pageY - map.container.offset().top
                );
             var targetCls = $(e.target).attr('class');

            if (latLng && (!targetCls || (targetCls && $(e.target).attr('class').indexOf('jvectormap-marker') === -1))) {
                markersCoords[markerIndex] = latLng;
                map.addMarker(markerIndex, {latLng: [latLng.lat, latLng.lng]});
                markerIndex += 1;

                socket.emit('vote', {latLng: [latLng.lat, latLng.lng]});
                console.log(getDistInKm({latLng: [55.7558, 37.6178]}, {latLng: [latLng.lat, latLng.lng]}))
            }
        });

    }
}

export default Visualization