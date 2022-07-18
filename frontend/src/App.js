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
import Users from "./components/Seller";
import UnAuth from "./components/unAuth";
import UserDetails from "./components/Seller/UserDetails";

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/users", element: <Users /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/seller/:id", element: <UserDetails /> },
    { path: "/403", element: <UnAuth /> },
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
