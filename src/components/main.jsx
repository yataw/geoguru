import React from 'react';
import ReactDOM from 'react-dom';

import Leaderboard from "./leaderboard";
import Game from "./game";
import Chat from "./chat";

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.socket = props.socket;
        this.state = {
            players: {},
            votes: {},
            markers: [],
            answer: null,
            task: null,
            markerAddingAvailable: false,
            messages: []
        }
    }

    addMessage = (message) => {
        this.setState((state) => {
            return {
                messages: [...state.messages, message]
            }
        });
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const {answer, votes, players, task} = nextProps;
        const markers = Object.values(votes).map(({id, lat, lng}) => ({
            id,
            color: players[id].color,
            lat,
            lng
        }));

        this.setState({...nextProps, markers, markerAddingAvailable: !answer && !!task});

        if (this.socket !== nextProps.socket)
        {
            this.socket = nextProps.socket;
            this.socket.on('chatmessage', this.addMessage);
        }
    }

    onAddMarker = marker => {
        this.setState((state) => {
            const markers = [...state.markers, marker];

            return {...state, markers, markerAddingAvailable: false};
        });

        this.socket.emit('vote', {lat: marker.lat, lng: marker.lng});
    };

    onMessage = text => {
        this.socket.emit('chatmessage', text);
    };

    render() {
        return (
            <main className="main">
                <Leaderboard players={this.state.players}></Leaderboard>
                <div className="game">
                    <div className="pie-cont">
                        <div className="pie-cont__element pie-cont__spinner"></div>
                        <div className="pie-cont__element pie-cont__filler"></div>
                        <div className="pie-cont__mask"></div>
                    </div>
                    <Game
                        markers={this.state.markers}
                        answer={this.state.answer}
                        onAddMarker={this.onAddMarker}
                        markerAddingAvailable={this.state.markerAddingAvailable}
                        task={this.state.task}
                    ></Game>
                </div>
                <Chat messages={this.state.messages} onMessage={this.onMessage}></Chat>
            </main>
        )
    }
}

export default Main;