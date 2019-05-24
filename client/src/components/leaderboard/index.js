import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, types, init} from 'config'
import RoundBoard from "../roundboard";
import MapArea from "../maparea";
import Footer from "../footer";

import 'bower_components/bootstrap/dist/css/bootstrap.css'
import './style.scss'


class LeaderBoard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {players, score} = this.props
        /**
         * TODO Момент регистрации пользователя произойдет после события END
         * При этом при Join и первом End прилетает пустой score
         * Сейчас фиксим вручную
         */
        const sorted = Object.keys(players).map(id => {
            if (!score[id])
                score[id] = new Score()

            return {
                id,
                name: players[id].name,
                dist: score[id].last.dist,
                lastScore: score[id].last.score,
                totalScore: score[id].total.score
            }
        }).sort((a, b) => b.totalScore - a.totalScore)

        return (
                <div className="leaderboard container-fluid h-100" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                    <h1>
                        <svg>
                            <use xlinkHref='#cup'/>
                        </svg>
                        Leaderboard
                    </h1>
                    <ol>
                        {
                            sorted.map(({id, name, dist, lastScore, totalScore}) => {
                                console.log(dist)
                                return (
                                    <li key={id}>
                                        <mark>{name}</mark>
                                        <small>
                                            <div className="d-flex justify-content-end align-items-end">
                                                <span>
                                                    accuracy: <span className={dist ? 'px-3' : 'px-3 text-danger'}>
                                                    {dist ? dist.toFixed(0) + 'km' : 'null'}
                                                </span>
                                                </span>
                                                <span className="px-3 text-success">total: {totalScore.toFixed(2)}</span>
                                            </div>

                                        </small>
                                    </li>
                                )
                            })
                        }
                    </ol>
                </div>
        )
    }
}

class Score {
    constructor() {
        /**
         * dist - разница между правильным ответом и ответом пользователя в км.
         *
         * @type {{dist: ?number, score: number}}
         */
        this.last = {dist: null, score: 0};

        /** @type {{score: number}}*/
        this.total = {score: 0};
    }

    add(score, dist) {
        this.last = {dist, score};
        this.score += score;
    }

    clear() {
        this.last = {dist: null, score: 0};
    }
}

export default LeaderBoard