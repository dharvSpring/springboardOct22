import React from "react";
import { Link } from "react-router-dom";
import './ColorPicker.css';

function ColorPicker(colors) {
    const colorName = Object.keys(colors);

    const colorsComp = colorName.map(color => (
        <Link key={color} to={`/colors/${color}`}>{color}</Link>
    ));

    return (
        <div className="ColorPicker">
            <h2>Pick a color!</h2>
            {colorsComp}
        </div>
    )
};

export default ColorPicker;