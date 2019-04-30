import * as actionTypes from '../actions/actionTypes';

const initialState = {
    error: null,
    loading: false,
    token: null,
    userId: null
};

const signUpStart = (state, action) => {
    const { email, password } = action.payload;
    return {
        ...state,
        loading: true,
        email: email,
        password: password,
        token: null,
        userId: null
    };
};

const signUpSuccess = (state, action) => {
    const { token, userId } = action.payload;
    return {
        ...state,
        loading: false,
        error: null,
        token: token,
        userId: userId
    };
};

const signUpFailed = (state, action) => {
    let { error } = action.payload;
    
    if(!error) error = { message: 'Unknown error, please try again.' };

    return {
        ...state,
        loading: false,
        error: error,
        token: null,
        userId: null
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SIGNUP_START:
            return signUpStart(state, action);
        case actionTypes.SIGNUP_SUCCESS:
            return signUpSuccess(state, action);
        case actionTypes.SIGNUP_FAIL:
            return signUpFailed(state, action);
        default:
            return state;
    }
};

export default reducer;
