import { v4 as uuid } from "uuid"

const DEFAULT_STATE = { todos: [] }

function RootReducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, { task: action.task, id: uuid() }] }
    case "REMOVE_TODO":
      return { ...state, todos: state.todos.filter(todo => todo.id !== action.id) }
    case "UPDATE_TODO":
      const todos = state.todos.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, task: action.updatedTask };
        }
        return todo
      });

      return {
        ...state, todos
      }
    default:
      return state;
  }
}

export default RootReducer;