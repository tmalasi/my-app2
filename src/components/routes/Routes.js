import { Routes as AppRoutes, Route } from "react-router-dom";
import ToDoList from "../todos/TodoListReducer";
import Api from "../toggle/Api";


const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/" element={<ToDoList/>} />
      <Route path="/api" element={<Api />} />
    </AppRoutes>
  );
};

export default Routes;