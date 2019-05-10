import React, {Component} from 'react'
import {render} from 'react-dom'

class Footer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="fixed-bottom d-flex justify-content-between"
                 style={{fontSize: 12, fontFamily: "Lucida Sans Unicode, Lucida Grande, sans-serif"}}>
                <div className="flex-row">
                    version: {this.props.version}
                </div>
                <div className="d-flex align-text-bottom align-items-end">
                    <div>Avialable on</div>
                    <div style={{width: 50}}>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/yataw/geoguru">
                            <img src="githubLogo.png" className="img-fluid" alt="gitLogo" style={{height: 'auto', width: 'auto'}}/>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer