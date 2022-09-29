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
import Admin from "./components/Admin";
import UserDetails from "./components/Seller/UserDetails";
import Product_details from "./components/Seller/product_details";
import Products from "./components/Seller/products";
import Packages from "./components/packages"
import Riders from "./components/Riders";
import Payments from "./components/payments";
import tracks from "./components/payments";
import Tracks from "./components/tracks ";
import WareHouse from "./components/warehouse";
import WareHouseActions from "./components/warehouse/actionPage";
import 'mapbox-gl/dist/mapbox-gl.css';
const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/sellers", element: <Sellers /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/seller/:id", element: <UserDetails /> },
    { path: "/seller/:bussiness_id/products", element: <Products /> },
    { path: "/packages", element: <Packages /> },
    { path: "/riders", element: <Riders /> },
    { path: "/mpesa-payments", element: <Payments /> },
    { path: "/tracks", element: <Tracks /> },
    { path: "/wahehouse", element: <WareHouse /> },
    { path: "/wahehouse/:slug", element: <WareHouseActions /> },

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
