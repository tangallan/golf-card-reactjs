import { CardDeck } from './Constants';

export const shuffleArray = (arr) => {
    const result = [...arr];

    result.forEach((val, key) => {
        // 52 cards in a deck
        let randomIndex = Math.ceil(Math.random() * (CardDeck.length-1));
        result[key] = result[randomIndex];
        result[randomIndex] = val;
    });

    return result;
};

export const initGame = (players) => {
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
        shuffledDeck: shuffledDeck,
        middleCards: middleCards,
        gamePlayers: gamePlayers
    }
};