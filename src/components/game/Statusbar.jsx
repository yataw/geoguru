import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Statusbar extends Component {
    constructor(props) {
        super(props);

        this.text = 'Waiting...';
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {task, answer} = nextProps;

        if (this.props.task !== task)
            return this.setText(task);
        
        if (this.props.answer !== answer)
            return this.setAnswer(answer);
    }

    setText = task => {
        const {city, country} = task;

        this.text = `${city}, ${country}`;
    };

    setAnswer = answer => {
        const {taskNumber, maxTasks} = answer;

        this.text = `Task ${taskNumber}/${maxTasks} is over`;
    };

    render() {
        return (
            <div className="game__statusbar statusbar">
                <div className="statusbar__current-target"><span>{this.text}</span></div>
                <div className="statusbar__info">
                    <table>
                        <tbody>
                        <tr>
                            <th>CoordX:</th>
                            <td>1156</td>
                        </tr>
                        <tr>
                            <th>CoordY:</th>
                            <td>2</td>
                        </tr>
                        <tr>
                            <th>Scale:</th>
                            <td>1,2</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

Statusbar.propTypes = {
    task: PropTypes.object.isRequired,
    answer: PropTypes.object.isRequired
};

export default Statusbar;