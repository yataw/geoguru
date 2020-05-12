import React from 'react';
import './App.css';
import './assets/fonts/source_sans_pro.css';
import {Events} from './general/general';
import Emitter from 'event-emitter'
import io from 'socket.io-client'

import Header from "./components/header/Header";
import Main from "./components/main/Main";
import Footer from "./components/footer/Footer";
import EntryPopup from "./components/popup/EntryPopup";

import Game from './game/game';

// TODO data validation
// TODO test
import leaders from './mockdata/leaders';

class App extends React.Component {
    constructor(props) {
        super(props);

        const isDevelopment = process.env.NODE_ENV === 'development';
        const hostname = isDevelopment ? window.location.hostname + ':' + process.env.REACT_APP_DEV_BACKEND_PORT : '';
        const socket = io.connect(hostname);

        this.standaloneGame = null;
        this.state = {
            players: {},
            votes: {},
            answer: {},
            task: {},
            showPopup: true,
            socket,
            offline: false,
            name: '',
            messages: []
        };

        this.listenSocket(socket);
    }

    listenSocket = (socket) => {
        socket.on(Events.taskstart, ({task}) => this.setState({task}));
        socket.on(Events.taskend, ({answer, votes, players}) => this.setState({answer, votes, players}));
        socket.on(Events.getplayers, ({players}) => this.setState({players}));
        socket.on(Events.chat_message, this.addMessage);
    };

    addMessage = (message) => {
        this.setState(state => ({messages: [...state.messages, message]}));
    };

    onMessage = text => {
        this.state.socket.emit(Events.chat_message, text);
    };

    /**
     * @param {lat, lng} marker
     */
    onAddMarker = marker => {
        this.state.socket.emit(Events.vote, marker);
    };

    keepStandalone = () => {
        const socket = new Emitter();

        this.listenSocket(socket);
        this.standaloneGame = new Game();
        this.standaloneGame.addPlayer({id: Math.random(), name: this.state.name, color: '000', socket});
        this.setState({socket});
    };

    onChooseName = (name) => {
        let offline = false;

        this.setState({
            showPopup: false,
            name
        }, () => {
            this.state.socket.on(Events.reconnecting, () => {
                if (!this.state.connected && !offline) {
                    offline = true;
                    this.setState({offline: true});
                }
            });

            this.state.socket.emit(Events.setname, {name});
        })
    };

    render() {
        return (
            <React.Fragment>
                {this.state.showPopup ? <EntryPopup onChooseName={this.onChooseName}></EntryPopup> : null}
                <Header
                    name={this.state.name}
                    offline={this.state.offline}
                    onOffline={this.keepStandalone}
                />
                <Main
                    players={this.state.players}
                    votes={this.state.votes}
                    task={this.state.task}
                    answer={this.state.answer}
                    onAddMarker={this.onAddMarker}
                    messages={this.state.messages}
                    onMessage={this.onMessage}
                    offline={this.state.offline}
                />

                <Footer />
                <div className="version">v1.0</div>
            </React.Fragment>
        )
    }
}

export default App;
