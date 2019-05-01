import * as actionTypes from './actionTypes';

export const creatingNewGame = () => {
    return {
        type: actionTypes.CREATING_NEW_GAME
    };
};

export const creatingNewGameComplete = () => {
    return {
        type: actionTypes.CREATING_NEW_GAME_COMPLETE
    };
};

export const createGameStart = (newGame) => {
    return {
        type: actionTypes.CREATE_GAME_START,
        payload: {
            newGame: newGame
        }
    };
};

export const createGameSuccess = (game) => {
    return {
        type: actionTypes.CREATE_GAME_SUCCESS,
        payload: {
            game: game
        }
    };
};

export const createGameFailed = (error) => {
    return {
        type: actionTypes.CREATE_GAME_FAILED,
        payload: {
            error: error
        }
    };
};


// fetching games / game
export const fetchingGames = () => {
    return {
        type: actionTypes.FETCHING_GAMES
    }
};

export const fetchGamesSuccess = (games) => {
    return {
        type: actionTypes.FETCH_GAMES_SUCCESS,
        payload: {
            games: games
        }
    }
};

export const fetchGamesFailed = (error) => {
    return {
        type: actionTypes.FETCH_GAMES_FAILED,
        payload: {
            error: error
        }
    };
};

export const fetchingSingleGame = (gameId) => {
    return {
        type: actionTypes.FETCHING_SINGLE_GAME,
        payload: {
            gameId: gameId
        }
    }
};

export const fetchSingleGameSuccess = (game) => {
    return {
        type: actionTypes.FETCH_SINGLE_GAME_SUCCESS,
        payload: {
            game: game
        }
    }
};

export const fetchSingleGameFailed = (error) => {
    return {
        type: actionTypes.FETCH_SINGLE_GAME_SUCCESS,
        payload: {
            error: error,
            game: null
        }
    }
};