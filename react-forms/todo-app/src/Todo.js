import React from "react";
import './Todo.css';

function Todo({id, text, handleRemove}) {
    const removeMe = (evt) => {
        handleRemove(id);
    }
    return (
        <div className="Todo">
            {text} 
            <button onClick={removeMe}>X</button>
        </div>
    )
}

export default Todo;