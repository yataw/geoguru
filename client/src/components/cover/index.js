import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, init, types} from 'config'
import MapArea from "../maparea";
import RoundBoard from "../roundboard";
import LeaderBoard from "../leaderboard";

class Cover extends Component{
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
            total: {}
        }

        socket.on(types.ServerEvents.START, this.onStart)
        socket.on(types.ServerEvents.END, this.onEnd)
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

    render() {
        return (
            <div className="container-fluid">
                <div className={"jumbotron"}>
                    <RoundBoard/>
                    <div className={"row"} style={{height: 400}}>
                        <MapArea height={'100%'} width={'75%'}/>
                        <LeaderBoard height={'100%'} width={'25%'} current={this.state.current} total={this.state.total}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Cover