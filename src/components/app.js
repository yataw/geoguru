import React, {Component} from 'react'
import {render} from 'react-dom'
import articles from '../fixtures'
import Article from './article'
import ArticleList from './articlelist'
import Visualization from './visualization'
import 'bower_components/bootstrap/dist/css/bootstrap.css'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {reverted: false}
    }

    revert = () => {
        this.setState({reverted: !this.state.reverted})
    }

    render() {
        return (
            <div className={"container"}>
                <div className={"jumbotron"}>
                    <div className={'mx-auto'} style={{width: '30vw', height: '10vh'}}>
                        <h1 className={'display-6'}>App name</h1>
                    </div>
                    <Visualization height={400} width={1000}/>
                    {/*<button onClick={this.revert}>Revert</button>*/}
                </div>
                {/*<ArticleList articles={articles} reverted={this.state.reverted}/>*/}
            </div>
        )
    }
}


export default App