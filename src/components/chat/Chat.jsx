import React from 'react';
import PropTypes from 'prop-types';

import SimpleBar from 'simplebar-react';
import '../../assets/css/simplebar.min.css';
import Sprite from '../../assets/img/sprite/sprite.svg';

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            autoScroll: true
        };

        this.scroll = {
            auto: true,
            value: 0
        }
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

    render() {
        return (
            <div className="chat">
                <div className="chat__header">
                    <svg className="chat__icon-people">
                        <use xlinkHref={`${Sprite}#icon-people_alt`}></use>
                    </svg>
                    Live chatting
                </div>
                <SimpleBar className="chat__message-box" >
                    {this.props.messages.map(({id, text, author, me}) => {
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
                </SimpleBar>

                <form className="chat__create-msg" onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        className="chat__input"
                        value={this.state.text}
                        onChange={this.onChange}
                        placeholder={this.props.offline ? 'Chat is disabled' : 'type your text here...'}
                        disabled={this.props.offline}
                    />

                    <svg className="chat__icon-send" onClick={this.onSubmit}>
                        <use xlinkHref={`${Sprite}#icon-keyboard_return`}></use>
                    </svg>
                </form>

            </div>
        )
    }
}

Chat.propTypes = {
    messages: PropTypes.array.isRequired,
    onMessage: PropTypes.func.isRequired
};

export default Chat;