import React from 'react';
import ReactDOM from 'react-dom';

import colorValues from './colorvalues.json';

const $ = window.$;

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            answer: null,
            markerAddingAvailable: false,
            task: null
        };

        this.map = null;
        this.currentMarker = props.currentMarker;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {markers, answer, task} = nextProps;
        this.setState({...nextProps});

        this.map.removeAllMarkers();
        markers.forEach(this.addMarker);

        if (!this.state.task && task)
            this.updateBorderAnimation();
        if (answer)
            this.addAnswer(answer);
    }

    updateBorderAnimation = () => {
        [
            document.querySelector('.pie-cont__spinner'),
            document.querySelector('.pie-cont__filler'),
            document.querySelector('.pie-cont__mask'),
        ].forEach(el => {
            const animationProp = getComputedStyle(el).animation;

            el.style.animation = 'none';
            void el.offsetWidth;
            el.style.animation = animationProp;
        });
    };

    componentDidMount() {
        this.map = new window.jvm.Map({
            container: window.$('#game-map'),
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
                    values: colorValues
                }]
            },
            zoomButtons: false,
            onRegionTipShow: function(e){e.preventDefault()},
        });

        this.map.container.click(this.onClick);
    }

    onClick = e => {
        if (!this.state.markerAddingAvailable)
            return;

        this.setState({markerAddingAvailable: false});

        let latLng = this.map.pointToLatLng(
            e.pageX - this.map.container.offset().left,
            e.pageY - this.map.container.offset().top
        );

       const marker = {...this.currentMarker, lat: latLng.lat, lng: latLng.lng};
       this.props.onAddMarker(marker);
    };

    addMarker = (marker) => {
        const {id, color, lat, lng} = marker;
        const style = this.getStyle(color);

        this.map.addMarker(id, {latLng: [lat, lng], style});
    };

    addAnswer = (answer) => {
        const {lat, lng} = answer;
        const style = this.getAnswerStyle();

        this.map.addMarker(0, {latLng: [lat, lng], style}); // id = 0
    };

    getStyle = (color) =>  {
        return {fill: `#${color}`, stroke: '#383f47'}
    };

    getAnswerStyle = () => {
        return {fill: '#fff', stroke: '#383f47'}
    };

    onMarkerTipShow = (e, label, markerId) => {
        const {lat, lng} = this.state.markers.find(({id}) => id === markerId) || {};

        if (lat === undefined || lng === undefined)
            return;

        this.map.tip.text(lat.toFixed(2) + ', ' + lng.toFixed(2));
    };

    render() {
        const {city, country} = this.state.task || {};
        const {taskNumber, maxTasks} = this.state.answer || {};
        let str = 'Waiting...';

        if (city && country)
            str = `${city}, ${country}`;
        else if (taskNumber && maxTasks)
            str = `Task ${taskNumber}/${maxTasks} is over`;

        return (
            <div className="game__content">
                <div className="game__statusbar statusbar">
                    <div className="statusbar__current-target"><span>{str}</span></div>
                    <div className="statusbar__info">
                        <table>
                            <tbody>
                            <tr>
                                <th>CoordX:</th>
                                <td>1156</td>
                            </tr>
                            <tr>
                                <th>CoordY:</th>
                                <td>2</td>
                            </tr>
                            <tr>
                                <th>Scale:</th>
                                <td>1,2</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="game__map" id="game-map"></div>
                <div className="game__content-substrate"></div>
            </div>
        )
    }
}

export default Game;