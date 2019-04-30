/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import cardGameDbAxios from '../../axios-db';
import { initNewGame } from '../../store/Utils';
import * as actions from '../../store/actions';

import Game from '../Game/Game';

class Home extends Component {
    state = {
        creatingNewGame: false,
        totalPlayers: 2,
        canCreateGame: true,
        selectedGame: null,
        isLoggingIn: true,
        isSigningUp: false
    };

    componentWillMount() {}

    componentDidMount() {
        this.props.fetchingGames();
    }

    startCreateNewGame = () => {
        this.setState({
            creatingNewGame: true
        });
    };

    cancelCreateNewGame = () => {
        this.setState({
            creatingNewGame: false
        });
    };

    saveNewGame = async () => {
        const newGame = initNewGame(
            [localStorage.getItem('userId')],
            this.state.totalPlayers
        );
        const response = await cardGameDbAxios.post(
            `/games.json?auth=${localStorage.getItem('token')}`,
            newGame
        );
        const game = {
            gameid: response.data.name,
            game: {
                ...newGame
            }
        };
        const currentGames = [...this.state.games];
        currentGames.push(game);
        this.setState({
            games: currentGames,
            creatingNewGame: false,
            totalPlayers: 2,
            canCreateGame: true
        });
    };

    setTotalPlayers = evt => {
        this.setState({
            totalPlayers: evt.target.value
        });

        if (isNaN(evt.target.value)) {
            this.setState({
                canCreateGame: false
            });
        } else {
            if (
                parseInt(evt.target.value) >= 2 &&
                parseInt(evt.target.value) <= 4
            ) {
                this.setState({
                    canCreateGame: true
                });
            } else {
                this.setState({
                    canCreateGame: false
                });
            }
        }
    };

    selectGame = (evt, g) => {
        evt.preventDefault();

        this.setState(
            {
                selectedGame: null
            },
            () => {
                this.setState({
                    selectedGame: g
                });
            }
        );
    };

    render() {
        // let games = this.state.games.map((m, idx) => {
        //     return (
        //         <li key={m.gameid}>
        //             <a href='#' onClick={evt => this.selectGame(evt, m)}>
        //                 {m.gameid}
        //             </a>
        //         </li>
        //     );
        // });
        // let createGameModal = this.state.creatingNewGame ? (
        //     <div className='modal-mask'>
        //         <div className='modal'>
        //             <div className='modal-head'>
        //                 <p className='modal-title'>New Game</p>
        //             </div>
        //             <div className='modal-body'>
        //                 <div className='form-control'>
        //                     <label>Number of Players?</label>
        //                     <br />
        //                     <small>Only up to 4 players</small>
        //                     <input
        //                         type='text'
        //                         placeholder='Enter number of players'
        //                         min='2'
        //                         max='4'
        //                         value={this.state.totalPlayers}
        //                         onChange={this.setTotalPlayers}
        //                     />
        //                 </div>
        //             </div>
        //             <div className='modal-footer'>
        //                 <button
        //                     className='button-primary'
        //                     onClick={this.saveNewGame}
        //                     disabled={!this.state.canCreateGame}
        //                 >
        //                     Create
        //                 </button>
        //                 <button
        //                     className='button-danger'
        //                     onClick={this.cancelCreateNewGame}
        //                 >
        //                     Cancel
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // ) : null;

        // let gameView = this.state.selectedGame ? (
        //     <div>
        //         <Game gameId={this.state.selectedGame.gameid} />
        //     </div>
        // ) : (
        //     <p>Please select or create a game.</p>
        // );

        // if (createGameModal) {
        //     return createGameModal;
        // }

        let gameList = null;
        if (this.props.loadingGames) {
            gameList = <p className='align-center'>Loading...</p>;
        } else {
            const gamesListElement = this.props.games.map((m, idx) => {
                return (
                    <li key={m.gameid}>
                        <a href='#' onClick={evt => this.selectGame(evt, m)}>
                            {m.gameid}
                        </a>
                    </li>
                );
            });

            gameList = (
                <ul className='sidebar-links'>
                    {gamesListElement}
                </ul>
            );
        }

        return (
            <div className='row'>
                <div className='col col-lg-4'>
                    <div className='sidebar sidebar-left'>
                        <div className='sidebar-category'>
                            <button
                                className='button-primary button-round'
                                onClick={this.startCreateNewGame}
                            >
                                Create New Game
                            </button>
                        </div>
                        {/* <ul className='sidebar-links'>{games}</ul> */}
                        {gameList}
                    </div>
                </div>
                <div className='col col-lg-8'>{/* {gameView} */}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        games: state.gameProvider.games,
        gameError: state.gameProvider.error,
        loadingGames: state.gameProvider.loadingGames,
        creatingNewGame: state.gameProvider.creatingNewGame
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchingGames: () => dispatch(actions.fetchingGames())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
