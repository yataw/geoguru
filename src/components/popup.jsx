import React from 'react';
import ReactDOM from 'react-dom';

class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };
    }

    componentDidMount() {
        const trigger = document.getElementById('popup-trigger');

        setTimeout(() => {
            trigger.click();
            window.history.replaceState(null, null, ' ');
        }, 0);
    }

    onChange = (e) => {
        const text = e.target.value;

        if (text.length <= 20)
            this.setState({text});
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.text)
            this.props.onChooseName(this.state.text);

        this.setState({text: ''});
    };

    render() {
        return (
            <div className="popup" id="popup">
                <div className="popup__content">
                    <form action="#" className="form" onSubmit={this.onSubmit}>
                        <h3 className='u-margin-bottom-medium'>Please enter your name</h3>
                        <div className="form__group">
                            <div className="form__input-cont">
                                <input type="text" className="form__input" placeholder="Your name" id="name"
                                       required
                                       autoComplete="off"
                                       value={this.state.text}
                                       onChange={this.onChange}
                                       autoFocus
                                />
                                <svg className="form__group-send" onClick={this.onSubmit}>
                                    <use xlinkHref="./img/sprite/sprite.svg#icon-keyboard_return"></use>
                                </svg>
                            </div>
                            <label htmlFor="name" className="form__label">Max 20 characters</label>
                        </div>
                        {/* TODO добавить colorPicker: Simonwep/pickr*/}
                        {/*                        <div className="form__group">
                            <h3>And pick up your marker color</h3>
                        </div>*/}
                    </form>
                </div>
                <a href="#popup" style={{display: 'none'}} id='popup-trigger'></a>
            </div>
        )
    }
}

export default Popup;