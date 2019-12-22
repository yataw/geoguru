import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Emitter from 'event-emitter'

import utils from './utils';

import Header from "./components/header";
import Main from "./components/main";
import Footer from "./components/footer";
import Popup from "./components/popup";

import Game from './game/game';


// TODO data validation
// TODO test
import leaders from './mockdata/leaders';

class App extends React.Component {
    constructor(props) {
        super(props);

        window.addEventListener('DOMContentLoaded', () => {
            utils.scroll.addToAll();
        });

        const isDevelopment = process.env.NODE_ENV === 'development';
        const hostname = isDevelopment ? `localhost:${process.env.REACT_APP_DEV_BACKEND_PORT}` : '';
        const socket = window.io.connect(hostname);

        this.standaloneGame = null;
        this.state = {
            players: {},
            votes: {},
            answer: null,
            task: null,
            showPopup: true,
            socket,
            offline: false,
            name: ''
        };

        socket.on('taskstart', task => this.setState({task, answer: null, votes: {}}));
        socket.on('taskend', ({answer, votes, players}) => this.setState({answer, votes, players, task: null}));
    }

    keepStandalone = () => {
        const socket = new Emitter();

        socket.on('taskstart', task => this.setState({task, answer: null, votes: {}}));
        socket.on('taskend', ({answer, votes, players}) => this.setState({answer, votes, players, task: null}));

        this.standaloneGame = new Game();
        this.standaloneGame.addPlayer({id: 1, name: this.state.name, color: '000', socket});

        this.setState(state => ({socket}));
    };

    onChooseName = (name) => {
        let offline = false;

        this.setState({
            showPopup: false,
            name
        }, () => {
            this.state.socket.on('reconnecting', () => {
                if (!this.state.connected && !offline) {
                    offline = true;
                    this.setState({offline: true});
                }
            });

            this.state.socket.emit("setname", {name});
        })
    };

    render() {
        return (
            <React.Fragment>
                {this.state.showPopup ? <Popup onChooseName={this.onChooseName}></Popup> : null}
                <Header name={this.state.name} offline={this.state.offline} onOffline={this.keepStandalone}/>
                <Main
                    socket={this.state.socket}
                    players={this.state.players}
                    votes={this.state.votes}
                    answer={this.state.answer}
                    task={this.state.task}
                    offline={this.state.offline}
                >
                </Main>
                <Footer />

                <div className="version">v1.0</div>
            </React.Fragment>
        )
    }
}

export default App;
