import './App.css';
import ToDoList from './components/ToDoList';
import TodoListReducer from './components/TodoListReducer';

function App() {
  return (
    <div className="App">
      {/* <ToDoList/> */}
      <TodoListReducer/>
    </div>
  );
}

export default App;
