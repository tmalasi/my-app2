import { useState, useEffect } from "react";

//fetching a list of todos from an API
const useFetchTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //allows you to write asynchronous code using await
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:8080/todos");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorText}`
          );
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch todos:", error);
      } finally {
        //indicate thatthe fetch operation is complete
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return { todos, loading, error, setTodos };
};
export default useFetchTodos;
