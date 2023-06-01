import React, { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import './CurrentColor.css';

function CurrentColor(colors) {
    const {color} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!(color in colors)) {
            navigate("/colors");
        }
    }, []);

    const hex = colors[color];
    const style = {backgroundColor: hex};
    return (
        <div className="CurrentColor" style={style}>
            <h1>This is {color}</h1>
            <Link to="/colors">Go Back</Link>
        </div>
    )
};

export default CurrentColor;