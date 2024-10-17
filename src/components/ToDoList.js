import React, {
  useState,
  useCallback,
  useMemo,
} from "react";
import Inputs from "./Inputs";
import CustomButton from "./CustomButton";
import TodoListDisplay from "./TodoListDisplay";
import Header from "./Header";
import "./ToDoList.css";
import useFetchTodos from "./useFetchTodos";

function ToDoList() {
  const { todos, loading, error, setTodos } = useFetchTodos(); // Use the custom hook
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [removeIndex, setRemoveIndex] = useState("");
  const [editMode, setEditMode] = useState(false);

  // Calculating completed and pending tasks using useMemo
  const completedTasksCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  const pendingTasksCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback((event) => {
    setDescription(event.target.value);
  }, []);

  const handleCompletedChange = useCallback((event) => {
    setCompleted(event.target.checked);
  }, []);

  const handleAddTask = useCallback(
    async (event) => {
      event.preventDefault();
      if (title.trim() && description.trim()) {
        const newTodo = {
          title: title.trim(),
          description: description.trim(),
          completed: false,
        };
        console.log(completed);

        try {
          // Send POST request to add a new todo
          const response = await fetch("http://localhost:8080/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
          });

          if (response.ok) {
            const createdTodo = await response.json();
            setTodos((prevTodos) => [...prevTodos, createdTodo]); // Update state with new todo from the server
            setTitle("");
            setDescription("");
          } else {
            alert("Error adding task.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        alert("Please fill all filds");
      }
    },
    [title, description, completed, setTodos]
  );

  const handleRemoveIndexChange = useCallback((e) => {
    setRemoveIndex(e.target.value);
  }, []);

  const handleRemoveTask = useCallback(async () => {
    const index = parseInt(removeIndex, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < todos.length) {
      const todoToRemove = todos[index];

      try {
        // Send DELETE request to remove the todo
        const response = await fetch(
          `http://localhost:8080/todos/${todoToRemove.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // After successful deletion, re-fetch todos to update the state
          const updatedTodosResponse = await fetch(
            "http://localhost:8080/todos"
          );
          const updatedTodos = await updatedTodosResponse.json();
          setTodos(updatedTodos); // Update state with the new list of todos
          setRemoveIndex("");
        } else {
          alert("Error removing task.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Invalid index. Please enter a valid task index.");
    }
  }, [removeIndex, todos,setTodos]);

  const handleEditTask = useCallback(() => {
    const index = parseInt(removeIndex, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < todos.length) {
      // Populate the form fields with the selected todo's data
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
      if (
        editMode &&
        title.trim() &&
        !isNaN(index) &&
        index >= 0 &&
        index < todos.length &&
        description.trim()
      ) {
        const todoToUpdate = {
          ...todos[index], // Preserve existing fields, especially the id
          title: title.trim(),
          description: description.trim(),
          completed,
        };

        try {
          // Send PUT request to update the todo
          const response = await fetch(
            `http://localhost:8080/todos/${todoToUpdate.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(todoToUpdate),
            }
          );

          if (response.ok) {
            // If the update is successful, update the local state
            setTodos((prevTodos) => {
              const updatedTodos = [...prevTodos];
              updatedTodos[index] = todoToUpdate; // Use the local object since it has the same data
              return updatedTodos;
            });
            // Reset the form state
            setTitle("");
            setDescription("");
            setCompleted(false);
            setRemoveIndex("");
            setEditMode(false);
          } else {
            alert("Error updating task.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while updating the task.");
        }
      } else {
        alert("You should enter all fileds");
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
      <Header text="TO DO LIST:" />{" "}
      <div className="todo-stats">
        <p>Completed tasks: {completedTasksCount}</p>
        <p>Tasks remaining: {pendingTasksCount}</p>
      </div>
      <div className="todo-container">
        <div className="todo-controls">
          <form onSubmit={editMode ? handleUpdateTask : handleAddTask}>
            <h2>{editMode ? "Edit task" : "Add a new task"}</h2>
            <Inputs
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder={
                editMode ? "Edit task title" : "Add a new task title"
              }
            />
            <Inputs
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              placeholder={
                editMode
                  ? "Edit task description"
                  : "Add a new task description"
              }
            />
            {editMode && (
              <label>
                <Inputs
                  type="checkbox"
                  checked={completed}
                  onChange={handleCompletedChange}
                />
                Completed
              </label>
            )}
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
            <CustomButton
              text="Remove Task by Index"
              onClick={handleRemoveTask}
            />
            <CustomButton text="Edit Task by Index" onClick={handleEditTask} />
          </div>
        </div>
        <div className="todo-list">
          <TodoListDisplay todos={todos} />
        </div>
      </div>
    </>
  );
}

export default ToDoList;
