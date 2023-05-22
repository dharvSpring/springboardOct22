import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import './NewBoxForm.css';

function NewBoxForm({callOnSubmit}) {
    const initialState = {
        width: '',
        height: '',
        backgroundColor: '',
    }
    let [formData, setFormData] = useState(initialState);

    const handleChange = (evt) => {
        const {name, value} = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value,
        }));
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        callOnSubmit({
            ...formData,
            id: uuid(),
        });
        setFormData(initialState);
    }

    return (
        <form className="NewBoxForm" onSubmit={handleSubmit}>
            <label htmlFor="backgroundColor">Background Color</label>
            <input
                type="text"
                id="backgroundColor"
                name="backgroundColor"
                placeholder="Background Color"
                value={formData.backgroundColor}
                onChange={handleChange}
            />

            <label htmlFor="width">Width</label>
            <input
                type="text"
                id="width"
                name="width"
                placeholder="Width"
                value={formData.width}
                onChange={handleChange}
            />

<           label htmlFor="height">Height</label>
            <input
                type="text"
                id="height"
                name="height"
                placeholder="Height"
                value={formData.height}
                onChange={handleChange}
            />

            <input type="submit" value="Add Box!" />
        </form>
    )
}

export default NewBoxForm;