import { put, delay, call, all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions/index';

// trigger by actionTypes.AUTH_CHECK_STATE
function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if(!token) {
        // logout
        yield put(actions.logout());
    } else {
        const expirtaionDate = yield new Date(localStorage.getItem('expirationDate'));
        const currentDate = yield new Date();

        if(expirtaionDate > currentDate) {
            const userId = yield localStorage.getItem('userId');
            yield put(actions.authSuccess(token, userId));

            const remainingMs = (expirtaionDate.getTime() - new Date().getTime()) / 1000;
            yield put(actions.authSetTimeout(remainingMs));
        } else {
            yield put(actions.logout());
        }
    }
};

// trigger by actionTypes.AUTH_SET_TIMEOUT
function* authSetTimeout(action) {
    yield delay(action.payload.expirationTime * 1000);
    yield put(actions.logout());
};

// trigger by actionTypes.AUTH_INITIATE_LOGOUT
function* logoutSaga(action) {
    yield localStorage.remove('token');
    yield localStorage.remove('expirationDate');
    yield localStorage.remove('userId');

    yield put(actions.logoutSucceed());
};

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga),
        takeEvery(actionTypes.AUTH_SET_TIMEOUT, authSetTimeout),
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga)
    ]);
}