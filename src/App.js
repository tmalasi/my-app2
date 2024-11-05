
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Routes from './components/routes/Routes';
import ToDoList from './components/ToDoList';
import TodoListReducer from './components/TodoListReducer';

function App() {
  return (
    <div className="App">
          <BrowserRouter>
            <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;
