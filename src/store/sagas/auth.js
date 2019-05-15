import { put, delay, call, all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions/index';
import rsf from '../firebase/rsf';

// import Firebase from '../firebase/firebase';
// const myFirebase = new Firebase();


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
    yield rsf.auth.signOut();
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');

    yield delay(3000);

    yield put(actions.logoutSucceed());
}

// trigger by actionTypes.AUTH_START
function* loggingIn(action) {
    const { email, password } = action.payload;    
    try {
        const fLoginResp = yield rsf.auth.signInWithEmailAndPassword(email, password);
        //const fLoginResp = yield myFirebase.loginWithEmailAndPassword(email, password);
        const { uid } = fLoginResp.user;
        const idToken = yield fLoginResp.user.getIdToken();

        const expirationDate = yield new Date(
            new Date().getTime() + (3600 * 1000)
        );
        yield localStorage.setItem('token', idToken);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield localStorage.setItem('userId', uid);

        yield put(actions.authSuccess(idToken, uid));
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
