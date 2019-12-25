import React from 'react';
import PropTypes from 'prop-types';

import Leaderboard from "../leaderboard/Leaderboard";
import Game from "../game/Game";
import Chat from "../chat/Chat";

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            canAddMarker: false,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {votes, players, answer, task} = nextProps;

        if (task !== this.props.task)
            this.setState({markers: [], canAddMarker: true});

        if (votes === this.props.votes)
            return;

        const markers = Object.values(votes).map(({id, lat, lng}) => ({
            id, // id игрока ?
            lat,
            lng,
            color: players[id].color,
            isAnswer: false
        }));

        markers.push(this.answerToMarker(answer));
        this.setState({markers, canAddMarker: false});
    }

    answerToMarker = (answer) => {
        const {id, lat, lng} = answer;
        // TODO color
        return {id, lat, lng, color: 'fff', isAnswer: true};
    };

    /**
     * @param {lat, lng} marker
     */
    onAddMarker = marker => {
        if (!this.state.canAddMarker)
            return;

        this.setState(state => ({markers: [...state.markers, marker], canAddMarker: false}));
        this.props.onAddMarker(marker);
    };

    render() {
        return (
            <main className="main">
                <Leaderboard players={this.props.players} />
                <div className="game">
                    <div className="pie-cont">
                        <div className="pie-cont__element pie-cont__spinner"></div>
                        <div className="pie-cont__element pie-cont__filler"></div>
                        <div className="pie-cont__mask"></div>
                    </div>
                    <Game
                        task={this.props.task}
                        answer={this.props.answer}
                        markers={this.state.markers}
                        onAddMarker={this.onAddMarker}
                    ></Game>
                </div>
                <Chat
                    messages={this.props.messages}
                    onMessage={this.props.onMessage}
                    offline={this.props.offline}></Chat>
            </main>
        )
    }
}

Main.propTypes = {
    players: PropTypes.object.isRequired,
    votes: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired,
    answer: PropTypes.object.isRequired,
    onAddMarker: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    offline: PropTypes.bool.isRequired
};

export default Main;