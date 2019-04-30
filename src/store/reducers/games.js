import * as actionTypes from '../actions/actionTypes';

const initialState = {
    creatingNewGame: false,
    loadingGames: false,
    games: [],
    error: null
};

const fetchingGames = (state, action) => {
    return {
        ...state,
        loadingGames: true
    };
};

const fetchGamesSuccess = (state, action) => {
    const { games } = action.payload;
    return {
        ...state,
        games: games,
        loadingGames: false
    };
};

const fetchGamesFailed = (state, action) => {
    const { error } = action.payload;
    return {
        ...state,
        error: error,
        games: [],
        loadingGames: false
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCHING_GAMES:
            return fetchingGames(state, action);
        case actionTypes.FETCH_GAMES_SUCCESS:
            return fetchGamesSuccess(state, action);
        case actionTypes.FETCH_GAMES_FAILED:
            return fetchGamesFailed(state, action);
        default:
            return state;
    }
};

export default reducer;