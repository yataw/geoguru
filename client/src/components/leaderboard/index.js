import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, types, init} from 'config'
import Card from '../card'

import './style.scss'


class LeaderBoard extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        const {current, total, width} = this.props

        return (
                <div className="leaderboard container-fluid h-100">
                    <h1>
                        <svg>
                            <use xlinkHref='#cup'/>
                        </svg>
                        Leaderboard
                    </h1>
                    <ol>
                        <li>
                            <mark>Luckia Lake</mark>
                            <small>100</small>
                        </li>
                        <li>
                            <mark>Los mierder</mark>
                            <small>301</small>
                        </li>
                        <li>
                            <mark>Paquito trae pan</mark>
                            <small>292</small>
                        </li>
                        <li>
                            <mark>Madrileños</mark>
                            <small>245</small>
                        </li>
                        <li>
                            <mark>Chotillos</mark>
                            <small>203</small>
                        </li>
                    </ol>
                    {/*            <div className="container-fluid h-100" style={{overflowY: 'auto', background: 'pink'}}>
                {Object.keys(total).map(key =>
                    <div className="row h-15" key={key}>
                        <Card data={{key, current: current[key], total: total[key]}}/>
                    </div>)
                }
            </div>*/}
                </div>
        )
    }
}

export default LeaderBoard