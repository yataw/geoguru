import React, {Component} from 'react'
import {render} from 'react-dom'
import * as conf from 'config'
import MapArea from './maparea'
import Cover from './cover'
import RoundBoard from './roundboard'

import 'bower_components/bootstrap/dist/css/bootstrap.css'

class App extends Component {
    constructor(props) {
        super(props)
        this.socket = window.socket
    }

    render() {
        return (
            <Cover>
                <RoundBoard />
                <MapArea height={400} width={1000}/>
            </Cover>
        )
    }
}

export default App