import React, {Component} from 'react';
import Sprite from '../../assets/img/sprite/sprite.svg';

class Header extends Component {
    constructor(props) {
        super(props);

        this.offline = (
            <div className="user-nav__offline" >
                <div className="user-nav__offline-text">Wow! You've lost the internet connection. Enable offline mode?</div>
                <button className="user-nav__offline-btn" onClick={this.onClick}>Let's try it</button>
            </div>
        );

        this.wait = (
            <div className="user-nav__offline">
                <div className="user-nav__offline-text">Please, wait...</div>
            </div>
        );

        this.ok = (
            <div className="user-nav__offline">
                <div className="user-nav__offline-text">Offline mode</div>
            </div>
        );

        this.state = {
            showOffline: false,
            offline: this.offline
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.offline)
            this.setState({showOffline: true});
    }

    onClick = e => {
        this.setState({offline: this.wait});
        setTimeout(() => (this.setState({offline: this.ok})), 10000);
        this.props.onOffline();
    };

    render() {
        const offline = this.props.offline;

        return (
            <header className="header">
                <nav className="user-nav">
                    <div className="user-nav__settings">
                        <svg className="user-nav__icon">
                            <use xlinkHref={`${Sprite}#icon-menu`}></use>
                        </svg>
                    </div>

                    { this.state.showOffline ? this.state.offline : null }

                    <div className="user-nav__statistics">
                        <svg className="user-nav__icon">
                            <use xlinkHref={`${Sprite}#icon-equalizer`}></use>
                        </svg>
                    </div>

                    <div className="user-nav__user">
                        <svg className="user-nav__photo">
                            <use xlinkHref={`${Sprite}#icon-account_circle`}></use>
                        </svg>
                        <div className="user-nav__name">{this.props.name}</div>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;