import React from 'react';
import ReactDOM from 'react-dom';
import utils from '../utils';

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: props.messages,
            text: '',
            autoScroll: true
        };

        this.scroll = {
            auto: true,
            value: 0
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({...nextProps});
    }

    onChange = (e) => {
        this.setState({
            text: e.target.value
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.text)
            this.props.onMessage(this.state.text);

        this.setState({text: ''});
    };

    onScroll = el => {
        // this.setState({autoScroll: el.scrollTop === el.scrollHeight});
        this.scroll.value = el.scrollTop;
        this.scroll.auto = el.scrollTop === el.scrollHeight;
    };

    componentDidUpdate() {
        const el = document.getElementById('chat-message-box');
        const scrollable = utils.scroll.add(el).getScrollElement();

        scrollable.addEventListener('scroll', () => this.onScroll(scrollable));
        if (this.scroll.auto)
            scrollable.scrollIntoView(false);
        else
            scrollable.scrollTop = this.scroll.value;
    }

    render() {
        return (
            <div className="chat">
                <div className="chat__header">
                    <svg className="chat__icon-people">
                        <use xlinkHref="./img/sprite/sprite.svg#icon-people_alt"></use>
                    </svg>
                    Live chatting
                </div>
                <div className="chat__message-box" id="chat-message-box" key={Math.random()}>
                    {this.state.messages.map(({id, text, author, me}) => {
                        return (
                            <div className={'message' + (me ? ' message_my' : '')} key={id}>
                                <div className="message__author">
                                    {me ? 'me': author}
                                </div>
                                <div className="message__text">
                                    {text}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <form className="chat__create-msg" onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        className="chat__input"
                        value={this.state.text}
                        onChange={this.onChange}
                        placeholder={'type your text here...'}
                    />

                    <svg className="chat__icon-send" onClick={this.onSubmit}>
                        <use xlinkHref="./img/sprite/sprite.svg#icon-keyboard_return"></use>
                    </svg>
                </form>

            </div>
        )
    }
}

export default Chat;