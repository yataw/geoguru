import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, init} from 'config'
import MapArea from './maparea'
import Cover from './cover'
import RoundBoard from './roundboard'
import LeaderBoard from './leaderboard'

import 'bower_components/bootstrap/dist/css/bootstrap.css'

class App extends Component {
    constructor(props) {
        super(props)
        socket.on('init', data => Object.assign(init, data))
    }

    render() {
        return <Cover />
    }
}

export default App