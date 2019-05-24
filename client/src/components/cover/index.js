import React, {Component} from 'react'
import {render} from 'react-dom'
import {$, socket, init, types} from 'config'
import MapArea from "../maparea";
import RoundBoard from "../roundboard";
import LeaderBoard from "../leaderboard";
import Footer from '../footer'
import 'bower_components/bootstrap/dist/css/bootstrap.css'

class Cover extends Component {
    constructor(props) {
        super(props)

        this.state = {
            /**
             * @type {Object<SocketId, CurrentMatchResult>}
             */
            current: {},
            /**
             * @type {Object<SocketId, Score>}
             */
            total: {},

            showNameInput: true,

            /**
             * @type {Object<SocketId, Player>}
             */
            players: {},

            /**
             * @type {Object<SocketId, Score>}
             */
            score: {},
            /**
             * @type {Object<SocketId, Summary.Vote>}
             */
            lastVotes: {}
        }


        socket.on(types.ServerEvents.START, this.onStart)
        socket.on(types.ServerEvents.END, this.onEnd)
        socket.on(types.ServerEvents.JOIN, this.onJoin)
        socket.on(types.ServerEvents.SIGNOUT, this.onSignOut)

        this.nameInput = (
            <div
                className="position-fixed w-100 h-100 d-flex justify-content-center align-items-center"
                style={{left: 0, top: 0, background: 'rgba(0, 0, 0, .5)'}}>
                <form className="w-25" onSubmit={this.onSubmit}>
                    <input
                        className="form-control"
                        type="text" name="name"
                        placeholder="Type your name and press enter to start a game"
                        autoComplete={"off"}
                        style={{opacity: 1, 'minWidth': 400}}
                        autoFocus
                    />
                </form>
            </div>
        )
    }

    onJoin = ({id, player}) => {
        if (!this.state.showNameInput)
            $.notify({
            title: "<strong>+1 Player:</strong> ",
            message: `${player.name} joined the game`
        }, {
            placement: {
                from: "bottom",
                align: "right",
                timer: 100,
            },
        });

        const players = Object.assign({}, this.state.players)
        //const score = Object.assign({}, this.state.score)
        const newcomer = players[id] = new Player(player)

        //score[socket.id] = new Score()

        //this.setState({players, score})
        this.setState({players})
    }

    onSignOut = id => {
        if (!this.state.showNameInput)
            $.notify({
                title: "<strong>-1 Player:</strong> ",
                message: `${this.state.players[id].name} left the game`
            }, {
                placement: {
                    from: "bottom",
                    align: "right",
                    timer: 500,
                },
            });

        const players = Object.assign({}, this.state.players)

        delete players[id]

        this.setState({players})
    }

    onStart = () => {

    }

    /**
     * @param {Object<SocketId, Score>} score
     * @param {Object<SocketId, Summary.Vote>} lastVotes
     */
    onEnd = ({score, lastVotes}) => {
        console.log(score)
        this.setState({score, lastVotes})
    }

    onSubmit = e => {
        const name = e.target.name.value || 'player';
        const players = Object.assign({}, this.state.players)
        //const score = Object.assign({}, this.state.score)
        const newcomer = players[socket.id] = new Player({name})

        //score[socket.id] = new Score()

        this.setState({showNameInput: false, players, /*score*/}, () => {
            socket.emit(types.ServerEvents.SIGNIN, newcomer)
        })

        e.preventDefault()
    }

    showNameInput = () => {
        if (this.state.showNameInput)
            return this.nameInput

        return null
    }

    render() {
        return (
            <div className="container-fluid vw-98 vh-100">
                <div className="row h-10">
                    <RoundBoard/>
                </div>
                <div className="row h-50" >
                    <div className="col-sm-8 px-1">
                        <MapArea height={'100%'} width={'100%'}/>
                    </div>
                    <div className="col-sm-4 px-1">
                        <LeaderBoard players={this.state.players} score={this.state.score}/>
                    </div>
                </div>

                <Footer />



                {this.showNameInput()}
            </div>
        )
    }
}

class Player {
    constructor(player) {
        this.name = player.name;
        this.avatar = null;
    }

    getName() {
        return this.name
    }
}

export default Cover