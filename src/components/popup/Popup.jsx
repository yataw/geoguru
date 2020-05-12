import React from 'react';
import Sprite from '../../assets/img/sprite/sprite.svg';
import {ReactComponent as Cake} from '../../assets/img/cake.svg'

class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };

        this.yourNameRef = React.createRef();
    }

    componentDidMount() {
        const trigger = document.getElementById('popup-trigger');

        setTimeout(() => {
            trigger.click();

            window.history.replaceState(null, null, ' ');
        }, 0);
    }

    onClick = (e) => {
        if (e.target === document.getElementById('popup-trigger'))
            return;

        this.props.onPopupClick();
    };

    render() {
        return (
            <div className="popup" id="popup" onClick={this.onClick}>
                <div className="popup__content">
                    <h2> Wow! </h2>
                    <div className='popup__text'>You've found secret functionality</div>
                    <a href="#popup" className="btn btn_white"> <div className="popup__btn-text">Got it <div className='cake-cont'><Cake className='cake'/></div></div></a>
                    <div className="popup__cross">✖</div>

                </div>
                <a href="#popup" style={{display: 'none'}} id='popup-trigger'></a>
            </div>
        )
    }
}

export default Popup;