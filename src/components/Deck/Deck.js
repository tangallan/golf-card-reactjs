import React from 'react';
import CardBack from '../../assets/Card-Back.png';

const deck = (props) => {
    // initial just show back of card for deck
    let deck = <div onClick={props.drawFromDeck}>
        <img style={{ width: '100%' }} src={CardBack} alt="back-of-card" />
    </div>;

    // if a card is drawn change the deck to be disable
    if (props.cardDrawn) {
        deck = <div>
            
        </div>
    }

    return deck;
};

export default deck;