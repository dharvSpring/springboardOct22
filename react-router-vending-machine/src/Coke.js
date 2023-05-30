import React from "react";
import { Link } from "react-router-dom";

function Coke() {
    return (
        <div className="Coke">
            <h1>Regular, Diet or zero sugar?</h1>
            
            <Link to="/">Go Back!</Link>
        </div>
    )
}

export default Coke;