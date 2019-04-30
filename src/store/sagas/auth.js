import { put, delay, call, all, takeEvery } from 'redux-saga/effects';

import axios from '../../axios-db';

import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions/index';

// trigger by actionTypes.AUTH_CHECK_STATE
function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if (!token) {
        // logout
        yield put(actions.logout());
    } else {
        const expirtaionDate = yield new Date(
            localStorage.getItem('expirationDate')
        );
        const currentDate = yield new Date();

        if (expirtaionDate > currentDate) {
            const userId = yield localStorage.getItem('userId');
            yield put(actions.authSuccess(token, userId));

            const remainingMs =
                (expirtaionDate.getTime() - new Date().getTime()) / 1000;
            yield put(actions.authSetTimeout(remainingMs));
        } else {
            yield put(actions.logout());
        }
    }
}

// trigger by actionTypes.AUTH_SET_TIMEOUT
function* authSetTimeoutSaga(action) {
    yield delay(action.payload.expirationTime * 1000);
    yield put(actions.logout());
}

// trigger by actionTypes.AUTH_INITIATE_LOGOUT
function* logoutSaga(action) {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');

    yield put(actions.logoutSucceed());
}

// trigger by actionTypes.AUTH_START
function* loggingIn(action) {
    const { email, password } = action.payload;

    const loginUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
        process.env.REACT_APP_FIREBASE_API_KEY
    }`;

    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    };

    try {
        const loginResp = yield axios.post(loginUrl, authData);
        const expirationDate = yield new Date(
            new Date().getTime() + loginResp.data.expiresIn * 1000
        );
        yield localStorage.setItem('token', loginResp.data.idToken);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield localStorage.setItem('userId', loginResp.data.localId);

        yield put(actions.authSuccess(loginResp.data.idToken, loginResp.data.userId));
        yield put(actions.authCheckState());
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.error.message);
            
            yield put(actions.authFail({
                message: error.response.data.error.message
            }));

        } else {
            yield put(actions.authFail({
                message: 'Unable to login, please try again.'
            }));
        }
    }
}

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga),
        takeEvery(actionTypes.AUTH_SET_TIMEOUT, authSetTimeoutSaga),
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
        takeEvery(actionTypes.AUTH_START, loggingIn)
    ]);
}
