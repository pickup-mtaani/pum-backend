import React from "react";
import Todo from "./views";
import Login from "./login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import AssignRider from "./components/assignRider";
import Layouts from "./views/Layouts";
import Dashboard from "./components/dashboard";
import Users from "./components/users";

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/users", element: <Users /> },
    { path: "/assign", element: <AssignRider /> },
    // ...
  ]);
  return routes;
};
const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
