import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Header extends Component {
    render() {
        return (
            <header className="header">
                <nav className="user-nav">
                    <div className="user-nav__settings">
                        <svg className="user-nav__icon">
                            <use xlinkHref="/img/sprite/sprite.svg#icon-menu"></use>
                        </svg>
                    </div>

                    <div className="user-nav__statistics">
                        <svg className="user-nav__icon">
                            <use xlinkHref="/img/sprite/sprite.svg#icon-equalizer"></use>
                        </svg>
                    </div>

                    <div className="user-nav__user">
                        <svg className="user-nav__photo">
                            <use xlinkHref="/img/sprite/sprite.svg#icon-account_circle"></use>
                        </svg>
                        <div className="user-nav__name">{this.props.name}</div>
                    </div>
                </nav>
            </header>
        )
    }
}

export default Header;