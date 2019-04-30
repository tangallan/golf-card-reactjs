import * as actionTypes from './actionTypes';

export const signUpStart = (email, password) => {
    return {
        type: actionTypes.SIGNUP_START,
        payload: {
            email: email,
            password: password
        }
    }
};

export const signUpSuccess = (token, userId) => {
    return {
        type: actionTypes.SIGNUP_SUCCESS,
        payload: {
            token: token,
            userId: userId
        }
    }
};

export const signUpFail = error => {
    return {
        type: actionTypes.SIGNUP_FAIL,
        payload: {
            error: error
        }
    }
};