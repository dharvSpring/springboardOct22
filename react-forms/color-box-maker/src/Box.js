import React from "react";
import './Box.css'

function Box({id, handleRemove, width=100, height=100, backgroundColor="cornflowerblue"}) {
    const boxStyle = {
        backgroundColor: backgroundColor,
        width: `${width}px`,
        height: `${height}px`,
    }
    const removeBox = () => {
        handleRemove(id);
    }

    return (
        <div className="Box">
            <div style={boxStyle} />
            <button onClick={removeBox}>Remove Me!</button>
        </div>
    )
}

export default Box;