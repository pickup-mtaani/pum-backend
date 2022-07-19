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
import Sellers from "./components/Seller";
import Admin from "./components/Seller copy";
import UserDetails from "./components/Seller/UserDetails";

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/sellers", element: <Sellers /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/seller/:id", element: <UserDetails /> },
    { path: "/administrators", element: < Admin /> },
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
