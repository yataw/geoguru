import React from 'react';
import PropTypes from 'prop-types';

import Map from './Map';
import Statusbar from './Statusbar';

class Game extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        const {task} = nextProps;

        if (task !== this.props.task)
            this.updateBorderAnimation();
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

    render() {
        return (
            <div className="game__content">
                <Statusbar answer={this.props.answer} task={this.props.task}></Statusbar>
                <Map onAddMarker={this.props.onAddMarker} markers={this.props.markers}></Map>
                <div className="game__content-substrate"></div>
            </div>
        )
    }
}

Game.propTypes = {
    task: PropTypes.object.isRequired,
    answer: PropTypes.object.isRequired,
    markers: PropTypes.array.isRequired,
    onAddMarker: PropTypes.func.isRequired,
};

export default Game;