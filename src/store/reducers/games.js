import * as actionTypes from '../actions/actionTypes';

const initialState = {
    startingToCreateNewGame: false,
    processingNewGame: false,
    loadingGames: false,
    games: [],
    error: null,
    newGame: null
};

const fetchingGames = (state, action) => {
    return {
        ...state,
        loadingGames: true,
        error: null,
        games: []
    };
};

const fetchGamesSuccess = (state, action) => {
    const { games } = action.payload;
    return {
        ...state,
        games: games,
        loadingGames: false,
        error: null
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

const creatingNewGame = (state, action) => {
    return {
        ...state,
        startingToCreateNewGame: true,
        error: null,
        newGame: null,
        processingNewGame: false
    };
};

const creatingNewGameComplete = (state, action) => {
    return {
        ...state,
        startingToCreateNewGame: false,
        error: null,
        newGame: null,
        processingNewGame: false
    };
};

const processingNewGame = (state, action) => {
    const { newGame } = action.payload;
    return {
        ...state,
        processingNewGame: true,
        newGame: newGame,
        error: null
    };
};

const createNewGameSuccess = (state, action) => {
    const { game } = action.payload;
    return {
        ...state,
        processingNewGame: false,
        startingToCreateNewGame: false,
        newGame: game,
        error: null
    };
};

const createNewGameFailed = (state, action) => {
    const { error } = action.payload;
    return {
        ...state,
        processingNewGame: false,
        error: error,
        newGame: null
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCHING_GAMES:
            return fetchingGames(state, action);
        case actionTypes.FETCH_GAMES_SUCCESS:
            return fetchGamesSuccess(state, action);
        case actionTypes.FETCH_GAMES_FAILED:
            return fetchGamesFailed(state, action);

        case actionTypes.CREATING_NEW_GAME:
            return creatingNewGame(state, action);
        case actionTypes.CREATING_NEW_GAME_COMPLETE:
            return creatingNewGameComplete(state, action);

        case actionTypes.CREATE_GAME_START:
            return processingNewGame(state, action);
        case actionTypes.CREATE_GAME_SUCCESS:
            return createNewGameSuccess(state, action);
        case actionTypes.CREATE_GAME_FAILED:
            return createNewGameFailed(state, action);

        default:
            return state;
    }
};

export default reducer;