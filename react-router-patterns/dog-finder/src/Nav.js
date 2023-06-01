import React from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";

function Nav({dogs}) {
    const dogNamesComp = dogs.map(dog => (
        <NavLink key={dog.name} to={`/dogs/${dog.name}`}>{dog.name}</NavLink>
    ));

    return (
        <div className="Nav">
            <NavLink to="/dogs" end>Home</NavLink>
            {dogNamesComp}
        </div>
    );
}

export default Nav;