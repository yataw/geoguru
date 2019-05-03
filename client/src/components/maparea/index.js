import React, {PureComponent} from 'react'
import {render} from 'react-dom'
import './style.css'
import colorValues from './colorvalues'
import {getDistInKm, getRandomColor} from './utils'

var $ = window.jQuery
window.jQuery.noConflict();

class MapArea extends PureComponent {
    constructor(props) {
        super(props)

        this.socket = window.socket
        this.id = this.socket.id
        this.clickedInMatch = false;

        this.map = null;

        /**
         * @type {{
         *  id: string,
         *  letLng: {let: number, lng: number},
         *  style: {fill: string, stroke: string}
         * }}
         */
        this.markers = {};
    }

    onClick = e => {
        if (this.clickedInMatch)
            return;

        this.clickedInMatch = true;

        let latLng = this.map.pointToLatLng(
            e.pageX - this.map.container.offset().left,
            e.pageY - this.map.container.offset().top
        );

        $(e.target).attr('class');

        this.addMarker(this.id, [latLng.lat, latLng.lng])

        this.socket.on('matchstart', () => {
            this.clickedInMatch = false;

            this.map.removeAllMarkers()
        });

        this.socket.on('matchend',
            /**
             * @param {VerboseAnswer} verboseAnswer
             * @param {Object<SocketId, CurrentMatchResult>} current
             * @param {Object<SocketId, Score>} total
             */
            ({verboseAnswer, current, total}) => {
                const {answer, info} = verboseAnswer;

                this.addMarker(MapArea.MarkerIndexes.ANSWER, answer)
                Object.keys(current).forEach(id => {
                    let vote = current[id].vote

                    this.addMarker(id, vote)
                })

                this.map.setFocus({lat: answer[0], lng: answer[1], scale: 2, animate: true})
        });

        this.socket.emit('vote', {latLng: [latLng.lat, latLng.lng]})
    }

    addMarker = (id, latLng) => {
        let marker = this.markers[id]

        if (marker) {
            marker.latLng = latLng
        } else {
            marker = {latLng}
            marker.style = this.getStyle(id)
            this.markers[id] = marker
        }
        console.log(latLng, id === this.id)
        this.map.addMarker(id, {latLng, style: marker.style})
    }

    getStyle = id =>  {
        return {fill: this.getFillColor(id), stroke: MapArea.Colors.Marker.Stroke}
    }

    getFillColor = id => {
        if (id === this.id)
            return MapArea.Colors.Marker.Fill.Special[MapArea.MarkerIndexes.ME]

        if (id === MapArea.MarkerIndexes.ANSWER)
            return MapArea.Colors.Marker.Fill.Special[MapArea.MarkerIndexes.ANSWER]

        let fillColor = null;
        let occupiedColors = (Object.values(this.markers) || []).map(({style: {fill}}) => fill)
        let availableColors = MapArea.Colors.Marker.Fill.Other

        availableColors.forEach((color) => {
            if (!fillColor && occupiedColors.indexOf(color) === -1)
                fillColor = color
        })

        return fillColor || getRandomColor()
    }

    onMarkerTipShow = (e, label, id) => {
        let latLng = this.markers[id].latLng;

        this.map.tip.text(latLng[0].toFixed(2) + ', ' + latLng[1].toFixed(2));
    }

    render() {
        const {width, height} = this.props;

        return (
            <div id='world-map' className={'mx-auto'} style={{width, height}}></div>
        )
    }

    componentDidMount() {
        this.map = new window.jvm.Map({
            container: $('#world-map'),
            map: 'world_mill_en',
            panOnDrag: true,
            focusOn: {
                x: 0.5,
                y: 0.5,
                scale: 2,
                animate: true
            },
            onMarkerTipShow: this.onMarkerTipShow,
            series: {
                regions: [{
                    scale: ['#C8EEFF', '#0071A4'],
                    normalizeFunction: 'polynomial',
                    colorValues
                }]
            }
        });

        this.map.container.click(this.onClick);
    }
}


/**
 * @emum {number}
 */
MapArea.MarkerIndexes = {
    ANSWER: 0,
    ME: 1
}

/**
 * @enum {string}
 */
MapArea.Events = {
    START: 'matchstart',
    END: 'matchend',
}

MapArea.Colors = {
    Marker: {
        Fill: {
            Special: {
                [MapArea.MarkerIndexes.ANSWER]: '#F80C16',
                [MapArea.MarkerIndexes.ME]: '#F8E23B'
            },
            Other: ['#08F810', '#0009F8', '#00C5F8', '#F800ED', '#F88F00', '#B1FF0B', '#A778FF', '#F8CCEF']
        },
        Stroke: '#383f47'
    }
}


export default MapArea