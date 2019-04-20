import * as actionTypes from './actionTypes';

export const startNewGame = () => {
    return {
        type: actionTypes.CREATE_NEW_GAME
    }
};

export const startNewGameSuccess = newGame => {
    return {
        type: actionTypes.CREATE_NEW_GAME_SUCCESS,
        game: newGame
    }
};

export const startNewGameFail = (error) => {
    return {
        type: actionTypes.CREATE_NEW_GAME_FAILED,
        error: error
    }
};


export const fetchActiveGames = (userid) => {
    return {
        type: actionTypes.FETCH_ACTIVE_GAMES,
        userid: userid
    }
};

export const fetchActiveGamesStart = () => {
    return {
        type: actionTypes.FETCH_ACTIVE_GAMES_START
    }
};

export const fetchActiveGamesSuccess = (games) => {
    return {
        type: actionTypes.FETCH_ACTIVE_GAMES_SUCCESS,
        games: games
    }
};

export const fetchActiveGamesFailed = (error) => {
    return {
        type: actionTypes.FETCH_ACTIVE_GAMES_FAILED,
        error: error
    }
};