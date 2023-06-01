import React from "react";
import { Link } from "react-router-dom";

import './DogList.css';

function DogList(dogs) {
    const listComp = dogs.map(dog => {
        return (
            <div className="DogList-dog" key={dog.name}>
                <Link to={`/dogs/${dog.name}`}>
                    {dog.name}
                    <img src={dog.src}/>
                </Link>
            </div>
        )
    });
    return (
        <div className="DogList">
            <h1>Look at these dogs</h1>
            <ul>
                {listComp}
            </ul>

        </div>
    )
}

export default DogList;