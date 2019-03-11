import React from 'react';
import CardBack from '../../assets/Card-Back.png';
import classes from './FaceDownCard.module.css';

import Card from '../Card/Card';

const faceDownCard = (props) => {
    let fdclasses = [];
    if(props.highlight) {
        fdclasses.push(classes.CardHighlight);
    }

    let card = <div onClick={props.onSelectCard}>
        <img 
            className={fdclasses.join(' ')}
            style={{ width: '100%' }}
            src={CardBack}
            alt="face-down-card" />
    </div>;

    if(props.isFlipped) {
        card = <Card
            highlight={props.highlight}
            suit={props.card.suit}
            number={props.card.number}
        />
    }

    return card;
}

export default faceDownCard;