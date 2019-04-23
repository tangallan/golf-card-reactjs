import { CardDeck } from './Constants';

const shuffleArray = (arr) => {
    const result = [...arr];

    result.forEach((val, key) => {
        // 52 cards in a deck
        let randomIndex = Math.ceil(Math.random() * (CardDeck.length-1));
        result[key] = result[randomIndex];
        result[randomIndex] = val;
    });

    return result;
};

export const initNewGame = (players, totalPlayers = 2) => {
    let shuffledDeck = shuffleArray(CardDeck);

    let middleCards = [];
    middleCards.push(shuffledDeck[0]);
    shuffledDeck = shuffledDeck.filter(f => f !== shuffledDeck[0]);

    let index = 0;
    let gamePlayers = {};
    players.forEach((v) => {
        gamePlayers[v] = {
            faceDownCards: [],
            faceUpCards: []
        };
        for(let i = 0; i < 3; i++) {
            gamePlayers[v].faceDownCards.push(shuffledDeck[index]);
            index++;
        }

        for (let i = 0; i < 3; i++) {
            gamePlayers[v].faceUpCards.push(shuffledDeck[index]);
            index++;
        }
    });
    shuffledDeck.splice(0, (index));

    return {
        drewCardFromDeck: false,
        middleCards: middleCards,
        deck: shuffledDeck,
        currentRound: 1,
        gamePlayers: gamePlayers,
        currentPlayer: players[0],
        flippedCards: [],
        gameHistory: {}, //{ 'player1': 'score', 'player2': 'score' ... }
        totalPlayers: totalPlayers,

        selectingFromMiddle: false,
        selectedMiddleCard: null,
        selectingFromFaceDown: false,
        selectingFromFaceUp: false,
        selectedCardFromGamePlay: null,
    };
};