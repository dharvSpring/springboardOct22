import React from 'react';
import './Pokecard.css';

function Pokecard({id, name, type, xp}) {
    const imgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return (
        <div className="Pokecard">
            <h3 className='Pokecard-title'>{name}</h3>
            <img className='Pokecard-img' src={imgSrc} alt={name}></img>
            <div className='Pokecard-text'>Type: {type}</div>
            <div className='Pokecard-text'>EXP: {xp}</div>
        </div>
    )
}

export default Pokecard;