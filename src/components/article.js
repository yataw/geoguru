import React, {PureComponent} from 'react'
import {render} from 'react-dom'

class Article extends PureComponent {
    state = {
        counter: 0
    }

    incrementCounter = () => {
        this.setState({counter: this.state.counter + 1})
    }

    render() {
        const {article, opened, changeOpened} = this.props

        return (
            <div className={'card mx-auto'} style={{width: '50%'}}>
                <div className={'card-header'}>
                    <h2 onClick={this.incrementCounter}>{article.title}
                        {' ' + this.state.counter}
                        <button onClick={changeOpened.bind(this, article.id)}
                                className={'btn btn-primary btn-lg float-right'}>{opened ? 'hide' : 'show'}
                        </button>
                    </h2>
                    <div className={'card-body'}>
                        <h6 className={'card-subtitle text-muted'}>creation date: {article.date}</h6>
                        <section style={{'display': opened ? 'block' : 'none'}}
                                 className={'card-text'}>{article.text}</section>
                    </div>

                </div>
            </div>
        );
    }
};

export default Article