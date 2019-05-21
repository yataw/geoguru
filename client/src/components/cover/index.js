import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, init, types} from 'config'
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

            user: {}
        }

        socket.on(types.ServerEvents.START, this.onStart)
        socket.on(types.ServerEvents.END, this.onEnd)
        
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

    onStart = () => {

    }

    /**
     * @param {VerboseAnswer} verboseAnswer
     * @param {Object<SocketId, CurrentMatchResult>} current
     * @param {Object<SocketId, Score>} total
     */
    onEnd = ({verboseAnswer, current, total}) => {
        this.setState({current, total})
    }

    onSubmit = e => {
        this.setState({showNameInput: false, user: {name: e.target.name.value || 'player'}}, () => {
            socket.emit(types.ServerEvents.SIGNIN, this.state.user)
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
                    <div className="col-sm-4">
                        <LeaderBoard current={this.state.current} total={this.state.total}/>
                    </div>
                </div>

                <Footer />



                {this.showNameInput()}
            </div>
        )
    }
}

export default Cover