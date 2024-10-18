import React, { useState, useCallback, useMemo } from "react";
import Inputs from "./dumbComponents/Inputs";
import CustomButton from "./dumbComponents/CustomButton";
import TodoListDisplay from "./dumbComponents/TodoListDisplay";
import Header from "./dumbComponents/Header";
import "./ToDoList.css";
import useFetchTodos from "./useFetchTodos";

function ToDoList() {
  // use the custom hook to fetch data
  const { todos, loading, error, setTodos } = useFetchTodos();

  // State variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [removeIndex, setRemoveIndex] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [completedFilter, setCompletedFilter] = useState("all"); // State for completed filter

  // Event handler functions wrapped in useCallback 
  //because otherwise will be recreated
  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback((event) => {
    setDescription(event.target.value);
  }, []);

  const handleCompletedChange = useCallback((event) => {
    setCompleted(event.target.checked);
  }, []);

  const handleRemoveIndexChange = useCallback((e) => {
    setRemoveIndex(e.target.value);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleCompletedFilterChange = useCallback((event) => {
    setCompletedFilter(event.target.value);
  }, []); // New completed filter change handler

  // Calculating completed and pending tasks using useMemo
  const completedTasksCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  const pendingTasksCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  // Filter todos based on the search query and completed filter
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const titleMatch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descriptionMatch = todo.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter based on the completed filter
      const completedMatch =
        completedFilter === "completed" ? todo.completed :
        completedFilter === "not_completed" ? !todo.completed :
        true; // "all" option, show all todos

      return (titleMatch || descriptionMatch) && completedMatch;
    });
  }, [todos, searchQuery, completedFilter]);

  const handleAddTask = useCallback(
    async (event) => {
      event.preventDefault();
      if (title.trim() && description.trim()) {
        const newTodo = {
          title: title.trim(),
          description: description.trim(),
        };

        try {
          const response = await fetch("http://localhost:8080/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
          });
          if (response.ok) {
            const createdTodo = await response.json();
            setTodos((prevTodos) => [...prevTodos, createdTodo]);
            setTitle("");
            setDescription("");
          } else {
            const errorText = await response.text();
            alert(`Error adding task: ${errorText || "Unknown error occurred."}`);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        alert("Please fill all fields");
      }
    },
    [title, description, setTodos]
  );

  const handleRemoveTask = useCallback(async () => {
    const index = parseInt(removeIndex, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < todos.length) {
      const todoToRemove = todos[index];

      try {
        const response = await fetch(`http://localhost:8080/todos/${todoToRemove.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const updatedTodosResponse = await fetch("http://localhost:8080/todos");
          const updatedTodos = await updatedTodosResponse.json();
          setTodos(updatedTodos);
          setRemoveIndex("");
        } else {
          const errorText = await response.text();
          alert(`Error removing task: ${errorText || "Unknown error occurred."}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Invalid index. Please enter a valid task index.");
    }
  }, [removeIndex, todos, setTodos]);

  const handleEditTask = useCallback(() => {
    const index = parseInt(removeIndex, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < todos.length) {
      const selectedTodo = todos[index];
      setTitle(selectedTodo.title);
      setDescription(selectedTodo.description);
      setCompleted(selectedTodo.completed);
      setEditMode(true);
    } else {
      alert("Invalid index. Please enter a valid task index.");
    }
  }, [removeIndex, todos]);

  const handleUpdateTask = useCallback(
    async (event) => {
      event.preventDefault();
      const index = parseInt(removeIndex, 10) - 1;
      if (editMode && title.trim() && description.trim()) {
        const todoToUpdate = {
          ...todos[index],
          title: title.trim(),
          description: description.trim(),
          completed,
        };

        try {
          const response = await fetch(`http://localhost:8080/todos/${todoToUpdate.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(todoToUpdate),
          });

          if (response.ok) {
            setTodos((prevTodos) => {
              const updatedTodos = [...prevTodos];
              updatedTodos[index] = todoToUpdate;
              return updatedTodos;
            });
            setTitle("");
            setDescription("");
            setCompleted(false);
            setRemoveIndex("");
            setEditMode(false);
          } else {
            const errorText = await response.text();
            alert(`Error updating task: ${errorText || "Unknown error occurred."}`);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while updating the task.");
        }
      } else {
        alert("You should enter all fields");
      }
    },
    [editMode, removeIndex, title, description, completed, todos, setTodos]
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Header text="TO DO LIST:" />
      <div className="todo-stats">
        <p>Completed tasks: {completedTasksCount}</p>
        <p>Tasks remaining: {pendingTasksCount}</p>
      </div>
      <br/>
      <div className="search-bar">
        <Inputs
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search task"
        />
        <label>
          Filter Completed: 
          <select value={completedFilter} onChange={handleCompletedFilterChange}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="not_completed">Not Completed</option>
          </select>
        </label>
      </div>
      <div className="todo-container">
        <div className="todo-controls">
          <form onSubmit={editMode ? handleUpdateTask : handleAddTask}>
            <h2>{editMode ? "Edit task" : "Add a new task"}</h2>
            <Inputs
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder={editMode ? "Edit task title" : "Add a new task title"}
            />
            <Inputs
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder={editMode ? "Edit task description" : "Add a new task description"}
            />
             {editMode && (
              <label>
                <Inputs
                  type="checkbox"
                  checked={completed}
                  onChange={handleCompletedChange}
                />
                Completed
              </label>)}
            <CustomButton text={editMode ? "Update" : "Add"} type="submit" />
          </form>
          <div>
            <Inputs
              type="number"
              value={removeIndex}
              onChange={handleRemoveIndexChange}
              placeholder="Enter index to edit or remove"
              min="0"
            />
            <CustomButton text="Remove Task by Index" onClick={handleRemoveTask} />
            <CustomButton text="Edit Task by Index" onClick={handleEditTask} />
          </div>
        </div>
        <div className="todo-list">
          <TodoListDisplay todos={filteredTodos} /> {/* Display filtered todos */}
        </div>
      </div>
    </>
  );
}

export default ToDoList;
