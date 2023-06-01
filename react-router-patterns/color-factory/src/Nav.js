import React from "react";
import { Link } from "react-router-dom";
import './Nav.css';

function Nav() {
    return (
        <div className="Nav">
            <h1>Welcome to the Color Factory.</h1>
            <Link to="/colors/new">Add New Color</Link>
        </div>
    )
};

export default Nav;