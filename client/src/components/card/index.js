import React, {Component} from 'react'
import {render} from 'react-dom'
import {socket, types, init} from 'config'

import 'bower_components/bootstrap/dist/css/bootstrap.css'


class Card extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {width, height, data: {total: {points}, key, current}} = this.props

        current = current ? {...current, dist: current.dist + 'km'} : {dist: '< no data ' + '>'}

        return <div className="col" style={{width: "100%", height: "100%", border: '2px solid black'}}>
            {`id: ${key.slice(0, 5)}\ntotal:${points}\ncurrent_dist: ${current.dist}`}
        </div>
    }
}

export default Card