import React from "react";
import './Card.css';

function Card({rotClass, imgUrl}) {
    const cssClasses = `Card ${rotClass}`;
    return (
        <img className={cssClasses} src={imgUrl} />
    )
}

export default Card;