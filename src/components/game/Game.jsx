import React from 'react';
import PropTypes from 'prop-types';

import Map from './Map';
import Statusbar from './Statusbar';
import {GameParameters} from '../../general/general';

const {active, passive} = GameParameters.phasesDuration;
const activeDuration = active / 1000 - 0.1 + 's'; // -0.1, чтобы анимация успевала сделать полный оборот
const passiveDuration = passive / 1000 - 0.1 + 's';

const activeColor = 'var(--color-accent)';
const passiveColor = 'var(--color-text)';

class Game extends React.Component {

    componentWillReceiveProps(nextProps, nextContext) {
        const {task, answer} = nextProps;

        if (task !== this.props.task)
            this.updateBorderAnimation(true);

        if (this.props.answer !== answer)
            this.updateBorderAnimation(false);
    }

    updateBorderAnimation = (isTask) => {
        const root = document.documentElement;

        if (isTask) {
            root.style.setProperty('--game-loading-animation-duration', activeDuration);
            root.style.setProperty('--game-status-color', activeColor);
        }
        else {
            root.style.setProperty('--game-loading-animation-duration', passiveDuration);
            root.style.setProperty('--game-status-color', passiveColor);
        }

        [
            document.querySelector('.pie-cont__spinner'),
            document.querySelector('.pie-cont__filler'),
            document.querySelector('.pie-cont__mask'),
        ].forEach(el => {
            const classList =  [...el.classList];

            el.classList.remove(...classList);
            void el.offsetWidth;
            el.classList.add(...classList);
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