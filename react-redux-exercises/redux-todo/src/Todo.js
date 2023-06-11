import React, { useState } from "react";

import './Todo.css';

function Todo({ task, updateTodo, deleteTodo, id }) {
  const [editingTask, setEditingTask] = useState(task);
  const [isEditing, setIsEditing] = useState(false);

  function handleRemove() {
    deleteTodo(id)
  }

  function toggleEdit() {
    setIsEditing(e => !e);
  }

  function handleChange(evt) {
    setEditingTask(evt.target.value);
  }

  function stopEditing(evt) {
    evt.preventDefault();
    updateTodo(id, task);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="Todo">
        <form onSubmit={stopEditing}>
          <input
            type="text"
            value={editingTask}
            onChange={handleChange}
          />
          <button>Stop Editing</button>
        </form>
      </div>
    );
  }

  return (
    <div className="Todo">
      {editingTask}
      <button onClick={toggleEdit}>Edit</button>
      <button onClick={handleRemove}>X</button>
    </div>
  );
}

export default Todo;
