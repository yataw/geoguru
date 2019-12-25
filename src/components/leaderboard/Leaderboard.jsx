import React from 'react';

import SimpleBar from 'simplebar-react';
import '../../assets/css/simplebar.min.css';

import First from '../../assets/img/first.png';
import Second from '../../assets/img/second.png';
import Third from '../../assets/img/third.png';
import {ReactComponent as Trophy} from '../../assets/img/trophy.svg'

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {players: props.players};
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({...nextProps})
    }

    getPlace = index => {
        if (index < 3) {
            const picture = Leaderboard.positionToPicture[index];

            return (
                <td className="stat__place">
                    {picture}
                </td>
            )
        }

        return (
            <td className="stat__place">{index + 1}</td>
        )
    };

    formatScore = (val) => {
        return +val > 0 ? `+${val}`: val;
    };

    render() {
        const sortedPlayers = Object.values(this.state.players).sort((a, b) => (b.score - a.score));

        return (
            <div className="leaderboard">
                <div className="leaderboard__header">
                    <Trophy className="leaderboard__trophy"/>
                    Leader board
                </div>

                <SimpleBar className="leaderboard__table table-viewport">
                        <table className="table stat">
                            <thead>
                            <tr>
                                <th className="stat__place">Place</th>
                                <th className="stat__name">Name</th>
                                <th className="stat__score">Score</th>
                                <th className="stat__score-change">&nbsp;</th>
                            </tr>
                            </thead>

                            <tbody>
                            {sortedPlayers.map(({id, name, score, scoreChange}, index) => (
                                <tr key={id}>
                                    {this.getPlace(index)}
                                    <td className="stat__name">{name}</td>
                                    <td className="stat__score">{score.toFixed(2)}</td>
                                    <td className="stat__score-change">{}</td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                </SimpleBar>
            </div>
        )
    }

    static positionToPicture = {
        0: <img src={First} alt="first" className="stat__img"/>,
        1: <img src={Second} alt="second" className="stat__img"/>,
        2: <img src={Third} alt="third" className="stat__img"/>
    }
}

export default Leaderboard;