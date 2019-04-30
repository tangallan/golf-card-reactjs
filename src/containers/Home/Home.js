/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import cardGameDbAxios from '../../axios-db';
import { initNewGame } from '../../store/Utils';
import axios from 'axios';

import Login from '../Login/Login';
import SignUp from '../Signup/Signup';
import Game from '../Game/Game';

class Home extends Component {
    state = {
        creatingNewGame: false,
        games: [],
        totalPlayers: 2,
        canCreateGame: true,
        selectedGame: null,
        isLoggingIn: true,
        isSigningUp: false
    };

    componentWillMount() {
        // if (localStorage.getItem('expirationDate')) {
        //     const currentDate = new Date();
        //     let expDate = new Date(localStorage.getItem('expirationDate'));
        //     expDate.setMinutes(expDate.getMinutes() - 15);

        //     if (expDate > currentDate) {
        //         if (localStorage.getItem('userId')) {
        //             this.setState({
        //                 isLoggingIn: false,
        //                 isSigningUp: false
        //             });

        //             const remaingMs = expDate.getTime() - new Date().getTime();
        //             setTimeout(() => {
        //                 this.setState({
        //                     isLoggingIn: true,
        //                     isSigningUp: false
        //                 });
        //             }, remaingMs);
        //         }
        //     } else {
        //         localStorage.clear();
        //     }
        // }
    }

    componentDidMount() {
        // if (localStorage.getItem('userId')) {
        //     this.getGamesForUser();
        // }
    }

    getGamesForUser = () => {
        cardGameDbAxios.get(`/games.json`).then(games => {
            let gamesMapped = [];
            if (games.data) {
                gamesMapped = Object.keys(games.data).map(m => {
                    return {
                        gameid: m,
                        game: {
                            ...games.data[m]
                        }
                    };
                });
            }

            this.setState({
                games: gamesMapped
            });
        });
    };

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
        const response = await cardGameDbAxios.post(`/games.json`, newGame);
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

    onSignUp = async (evt, email, password) => {
        evt.preventDefault();

        const constSignUpUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
            process.env.REACT_APP_FIREBASE_API_KEY
        }`;
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        try {
            await axios.post(constSignUpUrl, authData);
            this.setState({
                isSigningUp: false,
                isLoggingIn: true
            });
        } catch (error) {
            if (error.response) {
                // Request made and server responded
                // console.log(error.response.data.error.message);
                // console.log(error.response.status);
                // console.log(error.response.headers);
                alert(error.response.data.error.message);
            } else {
                alert('Unable to signup, please try again later.');
            }
        }
    };

    onCancelSignup = evt => {
        this.setState({
            isSigningUp: false,
            isLoggingIn: true
        });
    };

    onLogin = async (evt, email, password) => {
        evt.preventDefault();

        const loginUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
            process.env.REACT_APP_FIREBASE_API_KEY
        }`;
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        try {
            const loginResp = await axios.post(loginUrl, authData);
            const expirationDate = new Date(
                new Date().getTime() + loginResp.data.expiresIn * 1000
            );
            localStorage.setItem('token', loginResp.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', loginResp.data.localId);

            this.setState({
                isSigningUp: false,
                isLoggingIn: false
            }, () => {
                
            });
        } catch (error) {
            if (error.response) {
                // Request made and server responded
                // console.log(error.response.data.error.message);
                // console.log(error.response.status);
                // console.log(error.response.headers);
                alert(error.response.data.error.message);
            } else {
                alert('Unable to login, please try again.');
            }
        }
    };

    onChangeToSignUp = evt => {
        this.setState({
            isSigningUp: true,
            isLoggingIn: false
        });
    };

    render() {
        if (this.state.isLoggingIn) {
            return (
                <Login
                    onLogin={this.onLogin}
                    onTrySignUp={this.onChangeToSignUp}
                />
            );
        }

        if (this.state.isSigningUp) {
            return (
                <SignUp
                    onSignUp={this.onSignUp}
                    onCancelSignup={this.onCancelSignup}
                />
            );
        }

        let games = this.state.games.map((m, idx) => {
            return (
                <li key={m.gameid}>
                    <a href='#' onClick={evt => this.selectGame(evt, m)}>
                        {m.gameid}
                    </a>
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

        let gameView = this.state.selectedGame ? (
            <div>
                <Game gameId={this.state.selectedGame.gameid} />
            </div>
        ) : (
            <p>Please select or create a game.</p>
        );

        if (createGameModal) {
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
