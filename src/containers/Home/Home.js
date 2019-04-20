/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import cardGameDbAxios from '../../axios-db';
import { initNewGame } from '../../store/Utils';

class Home extends Component {
    state = {
        loadingGames: true,
        creatingNewGame: false,
        games: [],
        totalPlayers: 2,
        canCreateGame: true,
        selectedGame: null
    };

    componentDidMount() {
        cardGameDbAxios.get('/games.json').then(games => {
            const gamesMapped = Object.keys(games.data).map(m => {
                return {
                    gameid: m,
                    game: {
                        ...games.data[m]
                    }
                };
            });

            this.setState({
                games: gamesMapped,
                loadingGames: false
            });
        });
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
        const newGame = initNewGame(this.state.totalPlayers);
        const response = await cardGameDbAxios.post('/games.json', newGame);
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

        this.setState({
            selectedGame: g
        });
    };

    render() {
        let games = this.state.games.map((m, idx) => {
            return (
                <li key={m.gameid}>
                    <a href="#" onClick={(evt) => this.selectGame(evt, m)}>{m.gameid}</a>
                </li>
            );
        });
        let createGameModal = this.state.creatingNewGame ? (
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
                            disabled={!this.state.canCreateGame}
                        >
                            Create
                        </button>
                        <button
                            className='button-danger'
                            onClick={this.cancelCreateNewGame}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        ) : null;

        let gameView = this.state.selectedGame ? <div>
            <h1>{this.state.selectedGame.gameid}</h1>
        </div> : <p>Please select or create a game.</p>;

        if(createGameModal) {
            return createGameModal;
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
                        <ul className='sidebar-links'>{games}</ul>
                    </div>
                </div>
                <div className='col col-lg-8'>{gameView}</div>
            </div>
        );
    }
}

export default Home;
