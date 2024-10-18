import React from "react";
import "./ToDoListDisplay.css";

const TodoListDisplay = React.memo(({ todos }) => {
  return (
    <div className="todo-list-display">
      <h2 className="header">To Do List:</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span className="todo-title">{todo.title}</span> <br />
            <span className="todo-description">{todo.description}</span> <br />
            <span
              className={`todo-status ${
                todo.completed ? "completed" : "not-completed"
              }`}
            >
              Status: {todo.completed ? "Completed" : "Not Completed"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default TodoListDisplay;
