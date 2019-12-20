import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import utils from './utils';

import Header from "./components/header";
import Main from "./components/main";
import Footer from "./components/footer";
import Popup from "./components/popup";


// TODO data validation
// TODO test
import leaders from './mockdata/leaders';

class App extends React.Component {
    constructor(props) {
        super(props);

        window.addEventListener('DOMContentLoaded', () => {
            utils.scroll.addToAll();
        });

        this.state = {
            players: {},
            votes: {},
            answer: null,
            task: null,
            showPopup: true,
            socket: {on: () => null, emit: () => null},
            name: ''
        };
    }

    onChooseName = (name) => {
        const socket = window.io.connect('');

        socket.on('taskstart', task => this.setState({task, answer: null, votes: {}}));
        socket.on('taskend', ({answer, votes, players}) => this.setState({answer, votes, players, task: null}));
        socket.emit("setname", {name});

        this.setState({
            showPopup: false,
            socket,
            name
        })
    };

    render() {
        return (
            <React.Fragment>
                {this.state.showPopup ? <Popup onChooseName={this.onChooseName}></Popup> : null}
                <Header name={this.state.name}/>
                <Main
                    socket={this.state.socket}
                    players={this.state.players}
                    votes={this.state.votes}
                    answer={this.state.answer}
                    task={this.state.task}>
                </Main>
                <Footer />

                <div className="version">v1.0</div>
            </React.Fragment>
        )
    }
}

export default App;
