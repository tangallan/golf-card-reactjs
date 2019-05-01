import { put, all, takeEvery, takeLatest, delay } from 'redux-saga/effects';

import axios from '../../axios-db';
import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions/';

function* fetchingGames(action) {
    const token = yield localStorage.getItem('token');
    try {
        const games = yield axios.get(`/games.json?auth=${token}`);
        let gamesMapped = [];
        if (games.data) {
            gamesMapped = yield Object.keys(games.data).map(m => {
                return {
                    gameid: m,
                    game: {
                        ...games.data[m]
                    }
                };
            });
        }
        yield put(actions.fetchGamesSuccess(gamesMapped));
    } catch (error) {
        if (error.response) {
            yield put(
                actions.fetchGamesFailed({
                    message: error.response.data.error.message
                })
            );
        } else {
            yield put(
                actions.fetchGamesFailed({
                    message: "Can't get games right now, please try again."
                })
            );
        }
    }
}

function* creatingGame(action) {
    const { newGame } = action.payload;

    try {
        const response = yield axios.post(`/games.json?auth=${localStorage.getItem('token')}`, newGame );
        const game = {
            gameid: response.data.name,
            game: {
                ...newGame
            }
        };
        yield put(actions.createGameSuccess(game));
    } catch(error) {
        if (error.response) {
            yield put(
                actions.createGameFailed({
                    message: error.response.data.error.message
                })
            );
        } else {
            yield put(
                actions.createGameFailed({
                    message: "Can't create games right now, please try again."
                })
            );
        }
    }
}

function* createGameSuccess(action) {
    yield put(actions.creatingNewGameComplete());
    yield put(actions.fetchingGames());
}

export function* watchGame() {
    yield all([
        takeEvery(actionTypes.FETCHING_GAMES, fetchingGames),
        takeEvery(actionTypes.CREATE_GAME_START, creatingGame),
        takeEvery(actionTypes.CREATE_GAME_SUCCESS, createGameSuccess)
    ]);
}
