import React from 'react';

const TodoListDisplay = ({ todos }) => {
  return (
    <ol>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ol>
  );
};

export default TodoListDisplay;
