import React from "react";
import { Link } from "react-router-dom";
import "./Snack.css";

function Snack({ name, price }) {
    return (
        <div className="Snack">
            <Link exact to={`/${name.toLowerCase()}`}>{name} {price}</Link>
        </div>
    );
}

export default Snack;