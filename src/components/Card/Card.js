import React from 'react';
import classes from './Card.module.css';

function importAll(r) {
    let images = {};
    r.keys().map((item) => images[item.replace('./', '')] = r(item));
    return images;
}
const images = importAll(require.context('../../assets/cards', false, /\.(png|jpe?g|svg)$/));

const card = (props) => {
    let c = null;
    let cardClasses = [];
    if(props.highlight) {
        cardClasses.push(classes.CardHighlight);
    }

    if (props.number && props.suit ) {
        const img_src = images[`${props.number}_of_${props.suit}.png`];
        c = <div className={classes.Card}>
            <img
                className={cardClasses.join(' ')} 
                src={img_src} 
                alt={`${props.number}_of_${props.suit}.png`} />
        </div>;
    }
    return c;
};

export default card;