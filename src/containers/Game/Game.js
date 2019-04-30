import React, { Component } from 'react';

import Card from '../../components/Card/Card';
import Deck from '../../components/Deck/Deck';
import FaceDownCard from '../../components/FaceDownCard/FaceDownCard';
import UserScoreTable from '../../components/UserScoreTable/UserScoreTable';
import classes from './Game.module.css';

import Modal from '../../components/UI/Modal/Modal';

import axiosDb from '../../axios-db';

class Game extends Component {
    state = {};

    componentDidMount() {
        axiosDb.get(`/games/${this.props.gameId}.json?auth=${localStorage.getItem('token')}`)
            .then((res) => {
                this.setState({
                    ...res.data
                });
            });
    }

    drawFromDeckHandler = () => {
        const cardDrawn = this.state.deck[0];
        const middleCards = [cardDrawn, ...this.state.middleCards];

        const deck = this.state.deck.filter(f => f.key !== cardDrawn.key);
        this.setState({
            drewCardFromDeck: true,
            deck: deck,
            middleCards: middleCards
        });
    };

    selectCardFromMiddleHandler = card => {
        if (
            !this.state.selectingFromFaceUp &&
            !this.state.selectingFromFaceDown
        ) {
            this.setState(prevState => {
                return {
                    selectingFromMiddle: !prevState.selectingFromMiddle,
                    selectedMiddleCard:
                        prevState.selectedMiddleCard === null ? card : null
                };
            });
        }
    };

    selectCardFromFaceDownHandler = card => {
        if (!this.state.selectingFromFaceUp) {
            if (this.state.selectingFromMiddle) {
                this.setState(prevState => {
                    return {
                        selectedCardFromGamePlay: card
                    };
                });
            } else {
                if (
                    !!this.state.selectedCardFromGamePlay &&
                    this.state.selectedCardFromGamePlay !== card
                ) {
                    this.setState({
                        selectedCardFromGamePlay: card
                    });
                } else {
                    this.setState(prevState => {
                        return {
                            selectingFromFaceDown: !prevState.selectingFromFaceDown,
                            selectedCardFromGamePlay:
                                prevState.selectedCardFromGamePlay == null
                                    ? card
                                    : null
                        };
                    });
                }
            }
        }
    };

    selectCardFromFaceUpHandler = card => {
        if (!this.state.selectingFromFaceDown) {
            if (this.state.selectingFromMiddle) {
                this.setState(prevState => {
                    return {
                        selectedCardFromGamePlay: card
                    };
                });
            } else {
                if (
                    !!this.state.selectedCardFromGamePlay &&
                    this.state.selectedCardFromGamePlay !== card
                ) {
                    this.setState(prevState => {
                        return {
                            selectedCardFromGamePlay: card
                        };
                    });
                } else {
                    this.setState(prevState => {
                        return {
                            selectingFromFaceUp: !prevState.selectingFromFaceUp,
                            selectedCardFromGamePlay:
                                prevState.selectedCardFromGamePlay == null
                                    ? card
                                    : null
                        };
                    });
                }
            }
        }
    };

    swapClickHandler = () => {
        let middleCards = [...this.state.middleCards];
        const swappingWith = { ...this.state.selectedCardFromGamePlay };

        let flippedCards = [];
        if(this.state.flippedCards) {
            flippedCards = [...this.state.flippedCards];
        }

        let faceDownCards = [
            ...this.state.gamePlayers[this.state.currentPlayer].faceDownCards
        ];
        let faceUpCards = [
            ...this.state.gamePlayers[this.state.currentPlayer].faceUpCards
        ];

        const a = faceDownCards.findIndex(f => f.key === swappingWith.key);
        const b = faceUpCards.findIndex(f => f.key === swappingWith.key);

        if (a >= 0) {
            faceDownCards[a] = middleCards[0];
        } else if (b >= 0) {
            faceUpCards[b] = middleCards[0];
        }
        flippedCards.push(middleCards[0].key);

        middleCards[0] = swappingWith;

        this.setState({
            middleCards: middleCards,
            gamePlayers: {
                [this.state.currentPlayer]: {
                    faceDownCards: faceDownCards,
                    faceUpCards: faceUpCards
                }
            },
            flippedCards: flippedCards,

            selectingFromMiddle: false,
            selectedMiddleCard: null,
            selectingFromFaceDown: false,
            selectingFromFaceUp: false,
            selectedCardFromGamePlay: null
        }, () => {
            this.saveScoreIfNecc();
        });
    };

    flipClickHandler = () => {
        let flippedCards = [];
        if(this.state.flippedCards) {
            flippedCards = [...this.state.flippedCards];
        }
        
        flippedCards.push(this.state.selectedCardFromGamePlay.key);

        this.setState(
            {
                flippedCards: flippedCards,

                selectingFromMiddle: false,
                selectedMiddleCard: null,
                selectingFromFaceDown: false,
                selectingFromFaceUp: false,
                selectedCardFromGamePlay: null
            },
            () => {
                this.saveScoreIfNecc();
            }
        );
    };

    calculateScore = () => {
        let score = 0;
        let cardCache = {};

        let cardsToCount = [];
        const faceDownsThatsFlipped = this.state.gamePlayers[
            this.state.currentPlayer
        ].faceDownCards.filter(
            f => this.state.flippedCards && this.state.flippedCards.indexOf(f.key) >= 0
        );

        cardsToCount = [
            ...this.state.gamePlayers[this.state.currentPlayer].faceUpCards,
            ...faceDownsThatsFlipped
        ];

        cardsToCount.forEach((v, i) => {
            if (!cardCache[v.number]) {
                cardCache[v.number] = 1;
            } else {
                cardCache[v.number] = cardCache[v.number] + 1;
            }

            if (cardCache[v.number] === 2) {
                score = score - v.value;
                cardCache[v.number] = 0;
            } else {
                score = score + v.value;
            }
        });

        return score;
    };

    saveScoreIfNecc = () => {
        console.log('this.state.flippedCards', this.state.flippedCards);
        if (this.state.flippedCards && this.state.flippedCards.length === 3) {
            if (this.state.gameHistory[this.state.currentPlayer]) {
                let userGameHistory = {
                    ...this.state.gameHistory[this.state.currentPlayer],
                    history: [
                        ...this.state.gameHistory[this.state.currentPlayer][
                            'history'
                        ]
                    ]
                };
                userGameHistory.history.push({
                    round: this.state.currentRound,
                    score: this.calculateScore()
                });

                this.setState({
                    gameHistory: {
                        [this.state.currentPlayer]: {
                            history: userGameHistory.history
                        }
                    }
                });
            } else {
                this.setState({
                    gameHistory: {
                        [this.state.currentPlayer]: {
                            history: [
                                {
                                    round: this.state.currentRound,
                                    score: this.calculateScore()
                                }
                            ]
                        }
                    }
                });
            }
        }
    };

    render() {
        if(!this.state.currentPlayer) {
            return <p>Loading please wait...</p>
        }

        console.log(this.state);
        let totalUserScore = this.calculateScore();
        if (this.state.currentPlayer !== localStorage.getItem('userId')) {
            return (
                <Modal title='Move Complete'>
                    <p>Sorry! It is not your move yet.</p>
                    <p>Total Score: {totalUserScore}</p>
                </Modal>
            );
        }

        let currentCard = null;
        if (this.state.middleCards.length > 0) {
            currentCard = (
                <div
                    onClick={() =>
                        this.selectCardFromMiddleHandler(
                            this.state.middleCards[0]
                        )
                    }
                >
                    <Card
                        highlight={this.state.selectingFromMiddle}
                        suit={this.state.middleCards[0].suit}
                        number={this.state.middleCards[0].number}
                    />
                </div>
            );
        }

        let faceUpCardsList = null;
        let faceDownCardsList = null;

        if (
            this.state.gamePlayers &&
            this.state.gamePlayers[this.state.currentPlayer]
        ) {
            faceDownCardsList = this.state.gamePlayers[
                this.state.currentPlayer
            ].faceDownCards.map(v => {
                return (
                    <div key={`${v.suit}_${v.number}`} className='col col-sm-2'>
                        <FaceDownCard
                            highlight={
                                this.state.selectedCardFromGamePlay != null &&
                                this.state.selectedCardFromGamePlay.key ===
                                    v.key
                            }
                            onSelectCard={() =>
                                this.selectCardFromFaceDownHandler(v)
                            }
                            card={v}
                            isFlipped={
                                this.state.flippedCards && this.state.flippedCards.indexOf(v.key) > -1
                            }
                        />
                    </div>
                );
            });

            faceUpCardsList = this.state.gamePlayers[
                this.state.currentPlayer
            ].faceUpCards.map(v => {
                return (
                    <div
                        key={`${v.suit}_${v.number}`}
                        className='col col-sm-2'
                        onClick={() => this.selectCardFromFaceUpHandler(v)}
                    >
                        <Card
                            highlight={
                                this.state.selectedCardFromGamePlay != null &&
                                this.state.selectedCardFromGamePlay.key ===
                                    v.key
                            }
                            suit={v.suit}
                            number={v.number}
                        />
                    </div>
                );
            });
        }

        let selectMiddlePrompt = null;
        if (this.state.selectingFromMiddle) {
            selectMiddlePrompt = (
                <p className='alert alert-info'>
                    Please select the card you want to swap with.
                </p>
            );
        }

        let swapButton = (
            <button className='button-success' onClick={this.swapClickHandler}>
                Swap
            </button>
        );
        let flipButton = (
            <button className='button-info' onClick={this.flipClickHandler}>
                Flip
            </button>
        );

        let controlButtons = null;
        if (this.state.selectingFromMiddle || this.state.selectingFromFaceUp) {
            if (
                this.state.selectingFromMiddle &&
                this.state.selectedMiddleCard &&
                this.state.selectedCardFromGamePlay
            ) {
                controlButtons = <p>{swapButton}</p>;
            } else if (this.state.selectingFromFaceUp) {
                controlButtons = <p>{swapButton}</p>;
            }
        } else if (this.state.selectingFromFaceDown) {
            controlButtons = (
                <p>
                    {swapButton} {flipButton}
                </p>
            );
        }

        let game = (
            <>
                <div className='row'>
                    <div className='col col-sm-2 col-sm-offset-4'>
                        <Deck
                            drawFromDeck={this.drawFromDeckHandler}
                            cardDrawn={this.state.drewCardFromDeck}
                        />
                    </div>
                    <div className='col col-sm-2'>{currentCard}</div>
                </div>

                {selectMiddlePrompt}

                <div style={{ textAlign: 'center' }}>
                    ==== Face Down Card Section ====
                    <div className='row'>
                        <div className='col col-sm-3' />
                        {faceDownCardsList}
                    </div>
                    ==== Player Cards Section ====
                    <div className='row'>
                        <div className='col col-sm-3' />
                        {faceUpCardsList}
                    </div>
                    {controlButtons}
                </div>
            </>
        );

        // all the top cards has been flipped
        if (this.state.flippedCards && this.state.flippedCards.length === 3) {
            game = (
                <p className='alert alert-success'>
                    You do not have any more moves, game is complete.
                </p>
            );
        }

        return (
            <div className={classes.Game}>
                {game}
                <section className='section-secondary'>
                    <div className='card'>
                        <h3 className='card-title'>
                            Current Score: {totalUserScore}
                        </h3>
                    </div>
                </section>

                <section>
                    <div className='row'>
                        {this.state.gameHistory ? Object.keys(this.state.gameHistory).map((g, idx) => {
                            return (
                                <div className='col col-sm-6' key={idx}>
                                    <UserScoreTable
                                        user={g}
                                        scores={
                                            this.state.gameHistory[g].history
                                        }
                                    />
                                </div>
                            );
                        }) : null}
                    </div>
                </section>
            </div>
        );
    }
}

export default Game;
