import * as actionTypes from './actionTypes';

export const authCheckState = () => {
    return {
        type: actionTypes.AUTH_CHECK_STATE
    };
};

export const authStart = (email, password) => {
    return {
        type: actionTypes.AUTH_START,
        payload: {
            email: email,
            password: password
        }
    }
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: {
            token: token,
            userId: userId
        }
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        payload: {
            error: error
        }
    };
};

export const authSetTimeout = (expirationTime) => {
    return {
        type: actionTypes.AUTH_SET_TIMEOUT,
        payload: {
            expirationTime: expirationTime
        }
    };
}

export const logout = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    };
};

export const logoutSucceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};