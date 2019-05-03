import React, {Component} from 'react'
import {render} from 'react-dom'
import MapArea from "../maparea";

class Cover extends Component{
    render() {
        return (
            <div className={"container"}>
                <div className={"jumbotron"}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Cover