import React, { useState } from "react";
import "./NewColor.css";
import { useNavigate } from "react-router-dom";

function NewColor(handleAddColor) {
    const [formData, setFormData] = useState({ name: '', hex: '#000000'});
    const navigate = useNavigate()

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(form => ({
            ...form,
            [name]: value,
        }));
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        handleAddColor(formData);
        navigate("/colors");
    }

    const { name, hex } = formData;

    return (
        <div className="NewColor">
            <h2>Add a Color!</h2>
            <form className="NewColor-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Color Name: </label>
                <input type="text" name="name" placeholder="New Color Name" onChange={handleChange} value={name}/>

                <label htmlFor="hex">Pick a Color: </label>
                <input type="color" name="hex" onChange={handleChange} value={hex}/>

                <input type="submit" value="Add Color" />
            </form>
        </div>
    )
};

export default NewColor;