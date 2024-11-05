import { Routes as AppRoutes, Route, BrowserRouter } from "react-router-dom";
import ToDoList from "../TodoListReducer";
import Api from "../Api";

const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/" element={<ToDoList/>} />
      <Route path="/api" element={<Api />} />
    </AppRoutes>
  );
};

export default Routes;