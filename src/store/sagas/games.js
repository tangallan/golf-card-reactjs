import { put, all, takeEvery } from 'redux-saga/effects';

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

export function* watchGame() {
    yield all([
        takeEvery(actionTypes.FETCHING_GAMES, fetchingGames)
    ]);
}
