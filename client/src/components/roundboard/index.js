import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, types, init} from 'config'
import Cover from "../cover";

import 'bower_components/bootstrap/dist/css/bootstrap.css'

// TODO Получать продолжительность игры с сервера и запускать обратный отсчет

class RoundBoard extends Component {
    constructor(props) {
        super(props)

        this.socket = socket

        /** @type {types.Task}*/
        this.state = {city: 'city', country: 'country', time: 0}
        this.globalTime = performance.now()
        this.intervalId = null;

        this.socket.on(types.ServerEvents.START, this.onStart)
        this.socket.on(types.ServerEvents.END, this.onEnd)
    }

    onStart = /** @param {types.Task} task*/({task}) => {
        this.globalTime = performance.now()
        this.setState({...task, time: 0})

        this.intervalId = setInterval(this.updTime, 100)
    }


    onEnd = data => {
        clearInterval(this.intervalId)
        this.setState({time: 0})
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    updTime = () => {
        this.setState({time: ((performance.now() - this.globalTime) / 1000).toFixed(3)})
    }

    render() {
        const {country, city} = this.state

        return (
            <div className={'mx-auto text-center p-3'}>
                <div className="progress">
                    <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0"
                         aria-valuemax="100" style={{width: Math.ceil(this.state.time * 75) + '%'}}>
                        {this.state.time}
                    </div>
                </div>

                <span className={'h2'}>{city}</span>
                <span className={'h6 text-secondary'}>{country ? ` (${country})` : country}</span>
            </div>
        )
    }
}

export default RoundBoard