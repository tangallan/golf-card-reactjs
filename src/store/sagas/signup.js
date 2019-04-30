import { put, takeEvery, all } from 'redux-saga/effects';

import axios from '../../axios-db';

import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions';

function* signingUp(action) {
    const { email, password } = action.payload;

    const constSignUpUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
        process.env.REACT_APP_FIREBASE_API_KEY
    }`;
    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    };

    try {
        const resp = yield axios.post(constSignUpUrl, authData);
        const { idToken, localId } = resp.data;
        yield put(actions.signUpSuccess(idToken, localId));
    } catch (error) {
        if (error.response) {
            // Request made and server responded
            // console.log(error.response.data.error.message);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            yield put(actions.signUpFail({
                message: error.response.data.error.message
            }))
        } else {
            yield put(actions.authFail({
                message: 'Failed to sign up, please try again.'
            }));
        }
    }
}

export function* watchSignUp() {
    yield all([
        takeEvery(actionTypes.SIGNUP_START, signingUp)
    ]);
}