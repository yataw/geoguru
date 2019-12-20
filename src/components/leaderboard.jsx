import React from 'react';
import ReactDOM from 'react-dom';

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
            const url = './img/' + Leaderboard.positionToPictureMap[index];

            return (
                <td className="stat__place">
                    <img src={url} alt="place" className="stat__img" />
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
                    <object data="/img/trophy.svg" className="leaderboard__trophy"></object>
                    Leader board
                </div>

                <div className="leaderboard__table table-viewport scrollable">
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
                </div>
            </div>
        )
    }

    static positionToPictureMap = {
        0: 'first.png',
        1: 'second.png',
        2: 'third.png'
    }
}

export default Leaderboard;