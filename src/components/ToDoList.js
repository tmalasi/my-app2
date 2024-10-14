import React, { useState } from "react";
import Inputs from "./Inputs";
import CustomButton from "./CustomButton";
import TodoListDisplay from "./TodoListDisplay";
import Header from "./Header";

function ToDoList() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [removeIndex, setRemoveIndex] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleAddTask = (event) => {
    event.preventDefault();
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput("");
    }
  };

  const handleRemoveIndexChange = (e) => {
    setRemoveIndex(e.target.value);
  };

  const handleRemoveTask = () => {
    const index = parseInt(removeIndex, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < todos.length) {
      setTodos(todos.filter((_, i) => i !== index));
      setRemoveIndex("");
    } else {
      alert("Invalid index. Please enter a valid task index.");
    }
  };

  const handleEditTask = () => {
    const index = parseInt(removeIndex, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < todos.length) {
      setInput(todos[index]);
      setEditMode(true);
    } else {
      alert("Invalid index. Please enter a valid task index.");
    }
  };

  const handleUpdateTask = (event) => {
    event.preventDefault();
    const index = parseInt(removeIndex, 10) - 1;
    if (
      editMode &&
      input.trim() &&
      !isNaN(index) &&
      index >= 0 &&
      index < todos.length
    ) {
      const updatedTodos = [...todos];
      updatedTodos[index] = input.trim();
      setTodos(updatedTodos);
      setInput("");
      setRemoveIndex("");
      setEditMode(false);
    }
  };

  return (
    <div>
      <Header text="TO DO LIST:"/>
      <form onSubmit={editMode ? handleUpdateTask : handleAddTask}>
        <Inputs
          type="text"
          value={input}
          onChange={handleInputChange} // Correct usage of prop
          placeholder={editMode ? "Edit task" : "Add a new task"}
        />
        <CustomButton text={editMode ? "Update" : "Add"} type="submit" />
      </form>
      <TodoListDisplay todos={todos}/>
      <div>
        <Inputs
          type="number"
          value={removeIndex}
          onChange={handleRemoveIndexChange} // Correct usage of prop
          placeholder="Enter index to edit or remove"
          min="0"
        />
        <CustomButton text="Remove Task by Index" onClick={handleRemoveTask} />
        <CustomButton text="Edit Task by Index" onClick={handleEditTask} />
      </div>
    </div>
  );
}

export default ToDoList;
