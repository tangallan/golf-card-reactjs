import * as actionTypes from '../actions/actionTypes';

const initalState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirect: '/'
};

const authStart = (state, action) => {
    return {
        ...state,
        loading: true,
        error: null
    };
};

const authSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        error: null,
        token: action.payload.token,
        userId: action.payload.userId
    };
};

const authFail = (state, action) => {
    return {
        ...state,
        loading: false,
        error: action.payload.error
    };
};

const reducer = (state = initalState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_START : return authStart(state, action);
        case actionTypes.AUTH_SUCCESS : return authSuccess(state, action);
        case actionTypes.AUTH_FAIL : return authFail(state, action);
        default:
            return state;
    }
};

export default reducer;