/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import cardGameDbAxios from '../../axios-db';
import { initNewGame } from '../../store/Utils';
import * as actions from '../../store/actions';

import Game from '../Game/Game';

class Home extends Component {
    state = {
        totalPlayers: 2,
        canCreateGame: true
    };

    componentWillMount() {}

    componentDidMount() {
        this.props.fetchingGames();
    }

    startCreateNewGame = () => {
        // this.setState({
        //     creatingNewGame: true
        // });
        this.props.creatingNewGame();
    };

    cancelCreateNewGame = () => {
        // this.setState({
        //     creatingNewGame: false
        // });
        this.props.creatingNewGameComplete()
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

    saveNewGame = async () => {
        const newGame = initNewGame(
            [localStorage.getItem('userId')],
            this.state.totalPlayers
        );
        this.props.createNewGame(newGame);
        // const response = await cardGameDbAxios.post(
        //     `/games.json?auth=${localStorage.getItem('token')}`,
        //     newGame
        // );
        // const game = {
        //     gameid: response.data.name,
        //     game: {
        //         ...newGame
        //     }
        // };
        // const currentGames = [...this.state.games];
        // currentGames.push(game);
        // this.setState({
        //     games: currentGames,
        //     creatingNewGame: false,
        //     totalPlayers: 2,
        //     canCreateGame: true
        // });
    };

    selectGame = (evt, g) => {
        evt.preventDefault();
    };

    render() {
        if (this.props.startingToCreateNewGame) {
            return (
                <div className='modal-mask'>
                    <div className='modal'>
                        <div className='modal-head'>
                            <p className='modal-title'>New Game</p>
                        </div>
                        <div className='modal-body'>
                            <div className='form-control'>
                                <label>Number of Players?</label>
                                <br />
                                <small>Only up to 4 players</small>
                                <input
                                    type='text'
                                    placeholder='Enter number of players'
                                    min='2'
                                    max='4'
                                    value={this.state.totalPlayers}
                                    onChange={this.setTotalPlayers}
                                />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button
                                className='button-primary'
                                onClick={this.saveNewGame}
                                disabled={
                                    !this.state.canCreateGame ||
                                    this.props.processingNewGame
                                }
                            >
                                Create
                            </button>
                            <button
                                className='button-danger'
                                onClick={this.cancelCreateNewGame}
                                disabled={this.props.processingNewGame}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
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

            gameList = <ul className='sidebar-links'>{gamesListElement}</ul>;
        }

        return (
            <div className='row'>
                <div className='col col-lg-4'>
                    <div className='sidebar sidebar-left'>
                        <div className='sidebar-category'>
                            <button
                                className='button-primary button-round button-small'
                                onClick={this.startCreateNewGame}   
                            >
                                Create New Game
                            </button>
                            <button className='button-danger button-round button-small' onClick={this.props.logout} disabled={this.props.loggingOut}>
                                Logout
                            </button>
                        </div>
                        {/* <ul className='sidebar-links'>{games}</ul> */}
                        {gameList}
                    </div>
                </div>
                <div className='col col-lg-8'>
                    <Route path='/game/:id' exact component={<p>Game</p>} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        gameError: state.gameProvider.error,
        games: state.gameProvider.games,
        loadingGames: state.gameProvider.loadingGames,
        processingNewGame: state.gameProvider.processingNewGame,
        startingToCreateNewGame: state.gameProvider.startingToCreateNewGame,

        loggingOut: state.auth.loggingOut
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchingGames: () => dispatch(actions.fetchingGames()),
        createNewGame: game => dispatch(actions.createGameStart(game)),

        creatingNewGame: () => dispatch(actions.creatingNewGame()),
        creatingNewGameComplete: () => dispatch(actions.creatingNewGameComplete()),

        logout: () => dispatch(actions.logout())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
