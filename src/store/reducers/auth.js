import * as actionTypes from '../actions/actionTypes';

const initalState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirect: '/',
    email: '',
    password: '',
    loggingOut: false
};

const authStart = (state, action) => {
    return {
        ...state,
        loading: true,
        error: null,
        email: action.payload.email,
        password: action.payload.password
    };
};

const authSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        token: action.payload.token,
        userId: action.payload.userId,
        email: '',
        password: ''
    };
};

const authFail = (state, action) => {
    return {
        ...state,
        loading: false,
        error: action.payload.error,
        email: '',
        password: ''
    };
};

const authLogout = (state, action) => {
    return {
        ...state,
        loggingOut: true
    };
};

const authLoggedOut = (state, action) => {
    return {
        ...state,
        token: null,
        userId: null,
        error: null,
        loading: false,
        authRedirect: '/',
        email: '',
        password: '',
        loggingOut: false
    };
};

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state, action);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:
            return authFail(state, action);
        case actionTypes.AUTH_INITIATE_LOGOUT:
            return authLogout(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLoggedOut(state, action);
        default:
            return state;
    }
};

export default reducer;
