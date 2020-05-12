import React, {Component} from 'react';
import Sprite from '../../assets/img/sprite/sprite.svg';
import Popup from "../popup/Popup";

class Header extends Component {
    constructor(props) {
        super(props);

        this.offline = (
            <div className="user-nav__offline" >
                <div className="user-nav__offline-text">Wow! You've lost the internet connection. Enable offline mode?</div>
                <button className="user-nav__offline-btn" onClick={this.onOfflineClick}>Let's try it</button>
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
            offline: this.offline,
            showPopup: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.offline)
            this.setState({showOffline: true});
    }

    onOfflineClick = e => {
        this.setState({offline: this.wait});
        setTimeout(() => (this.setState({offline: this.ok})), 10000);
        this.props.onOffline();
    };

    onBtnClick = () => {
        this.setState({showPopup: true});
    };

    hidePopup = () => {
        this.setState({showPopup: false});
    };

    render() {
        const offline = this.props.offline;

        return (
            <React.Fragment>
                {this.state.showPopup ? <Popup onPopupClick={this.hidePopup}/> : null}
                <header className="header">
                    <nav className="user-nav">
                        <div className="user-nav__settings" onClick={this.onBtnClick}>
                            <svg className="user-nav__icon">
                                <use xlinkHref={`${Sprite}#icon-menu`}></use>
                            </svg>
                        </div>

                        {this.state.showOffline ? this.state.offline : null}

                        <div className="user-nav__statistics" onClick={this.onBtnClick}>
                            <svg className="user-nav__icon">
                                <use xlinkHref={`${Sprite}#icon-equalizer`}></use>
                            </svg>
                        </div>

                        <div className="user-nav__user"  onClick={this.onBtnClick}>
                            <svg className="user-nav__photo">
                                <use xlinkHref={`${Sprite}#icon-account_circle`}></use>
                            </svg>
                            <div className="user-nav__name">{this.props.name}</div>
                        </div>
                    </nav>
                </header>
            </React.Fragment>
        )
    }
}

export default Header;