import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {VectorMap} from "react-jvectormap";
import regionColors from "./regioncolors";

class Map extends Component {
    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
        this.map = null;
    }

    componentDidMount() {
        this.map = this.mapRef.current.getMapObject();
        this.map.container.click(this.onClick);
    }
    
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {markers} = nextProps;

        this.map.removeAllMarkers();
        markers.forEach(this.addMarker);

        // jquery-карта перерисовыватся самостоятельно
        return false;
    }

    onClick = e => {
        let latLng = this.map.pointToLatLng(
            e.pageX - this.map.container.offset().left,
            e.pageY - this.map.container.offset().top
        );

        const marker = {lat: latLng.lat, lng: latLng.lng};

        this.props.onAddMarker(marker);
    };

    /**
     * @param {id, ?color, lat, lng, isAnswer} marker
     */
    addMarker = (marker) => {
        // TODO isAnswer
        const {id, color, lat, lng, isAnswer} = marker;
        const style = this.getStyle(color);

        this.map.addMarker(id, {latLng: [lat, lng], style});
    };

    addAnswer = (answer) => {
        const {lat, lng} = answer;
        const style = this.getAnswerStyle();

        this.map.addMarker(0, {latLng: [lat, lng], style}); // id = 0
    };

    getStyle = (color) => {
        return {fill: `#${color}`, stroke: '#383f47'}
    };

    getAnswerStyle = () => {
        return {fill: '#fff', stroke: '#383f47'}
    };

    onMarkerTipShow = (e, label, markerId) => {
        const {lat, lng} = this.props.markers.find(({id}) => id === markerId) || {};

        if (lat === undefined || lng === undefined)
            return;

        this.map.tip.text(lat.toFixed(2) + ', ' + lng.toFixed(2));
    };

    render() {
        return (
            <div className="game__map" id="game-map">
                <VectorMap map='world_mill'
                           focusOn={{
                               x: 0.5,
                               y: 0.5,
                               scale: 2,
                               animate: true
                           }}
                           ref={this.mapRef}
                           onMarkerTipShow={this.onMarkerTipShow}
                           series={{
                               regions: [{
                                   scale: ['#C8EEFF', '#0071A4'],
                                   normalizeFunction: 'polynomial',
                                   values: regionColors
                               }]
                           }}
                           containerStyle={{
                               width: '100%',
                               height: '100%'
                           }}
                           zoomButtons={false}
                />
            </div>
        );
    }
}

Map.propTypes = {
    markers: PropTypes.array.isRequired,
    onAddMarker: PropTypes.func.isRequired,
};

export default Map;