import React, { useState } from "react";
import './BoxList.css';

import Box from './Box';
import NewBoxForm from "./NewBoxForm";

function BoxList() {
    const [boxes, setBoxes] = useState([]);
    const addBox = (box) => {
        setBoxes(boxes => [...boxes, box]);
    };
    const removeBox = (id) => {
        setBoxes(boxes => boxes.filter(box => box.id !== id));
    };

    const boxComps = boxes.map(box => (
        <Box
            key={box.id}
            id={box.id}
            width={box.width}
            height={box.height}
            backgroundColor={box.backgroundColor}
            handleRemove={removeBox}
        />
    ));

    return (
        <div className="BoxList">
            <NewBoxForm callOnSubmit={addBox}/>
            {boxComps}
        </div>
    )
}

export default BoxList;