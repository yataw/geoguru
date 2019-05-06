import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, types, init} from 'config'
import Card from '../card'

import 'bower_components/bootstrap/dist/css/bootstrap.css'


class LeaderBoard extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        const {current, total, width} = this.props

        return (
            <div className="container-fluid" style={{width: width, height:"100%", overflowY: 'scroll'}}>
                {Object.keys(total).map(key =>
                    <div className="row" key={key} style={{width:"100%", height:"20%"}}>
                        <Card data={{key, current: current[key], total: total[key]}}/>
                    </div>)
                }
            </div>
        )
    }
}

export default LeaderBoard