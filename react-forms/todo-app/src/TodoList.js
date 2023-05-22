import React, { useState } from "react";
import './TodoList.css';

import Todo from "./Todo";
import NewTodoForm from './NewTodoForm';

function TodoList() {
    const [todoList, setTodoList] = useState([]);

    const addTodo = ({id, todoText}) => {
        setTodoList([
            ...todoList,
            {id, text: todoText},
        ]);
    }

    const removeTodo = (id) => {
        setTodoList(todoList.filter(todo => (todo.id !== id)));
    }

    const todoListComp = todoList.map(todo => {
        return (
            <Todo key={todo.id} id={todo.id} text={todo.text} handleRemove={removeTodo} />
        )
    })

    return (
        <div className="TodoList">
            <h1>Todo!</h1>
            <NewTodoForm handleSubmit={addTodo}/>
            {todoListComp}
        </div>
    )
}

export default TodoList;