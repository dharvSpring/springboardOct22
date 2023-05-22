import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import './NewTodoForm.css';

function NewTodoForm({handleSubmit}) {
    const initialValues = {todoText: ''};
    let [formData, setFormData] = useState(initialValues);

    const handleChange = (evt) => {
        const {name, value} = evt.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const submitTodo = (evt) => {
        evt.preventDefault();
        handleSubmit({
            ...formData,
            id: uuid(),
        });
        setFormData(initialValues);
    }
    return (
        <form className="NewTodoForm" onSubmit={submitTodo}>
            <label htmlFor="todoText">New Todo</label>
            <input type="text" id="todoText" name="todoText" value={formData.todoText} onChange={handleChange} />
            <input type="submit" value="Add Todo!" />
        </form>
    )
}

export default NewTodoForm;