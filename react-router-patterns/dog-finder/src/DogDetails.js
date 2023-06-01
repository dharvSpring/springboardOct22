    import React from "react";
import './DogDetails.css';
import { useParams } from "react-router-dom";

function DogDetails(dogs) {
    const {name} = useParams();
    const {facts, src, age} = dogs.find(dog => (dog.name === name));
    const factsComp = facts.map((fact) => (<p key={fact.length}>{fact}</p>));

    return (
        <div className="DogDetails">
            <img src={src} alt={name} />
            <h2>Hi I'm {name} and I'm {age} years old</h2>

            <div className="DogDetails-facts">
                Some facts about me:
                {factsComp}
            </div>

        </div>
    );
}

export default DogDetails;