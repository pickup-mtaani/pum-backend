import React from "react";
import Login from "./login";
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";
import Dashboard from "./components/dashboard";
import Sellers from "./components/Seller";
import UserDetails from "./components/Seller/UserDetails";
import Products from "./components/Seller/products";
import Packages from "./components/packages"
import AgentPackages from "./components/packages/aent"
import Riders from "./components/Riders";
import Payments from "./components/payments";
import Tracks from "./components/tracks ";
import WareHouse from "./components/warehouse";
import Assign_Agent_package_riderWareHouse from "./components/warehouse/agent/assignRider";
import Agents from "./components/agents ";
import WHdoorstep from "./components/warehouse/doorstep";
import PickFromRider from "./components/warehouse/doorstep/pick";
import PickFromRiderPage from "./components/warehouse/doorstep/riderpage";
import GIvetoRiderPage from "./components/warehouse/doorstep/give";
import AsRiderPage from "./components/warehouse/doorstep/assignRider";
import WHAgent from "./components/warehouse/agent";
import Routes from "./components/routes";
import WareHouseActions from "./components/warehouse/actionPage";
import 'mapbox-gl/dist/mapbox-gl.css';
import Riderpage from "./components/warehouse/riderpage";
import AgentsDetails from "./components/agents /agentsDetails";
import AssignRider from "./components/assignRider";
const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/sellers", element: <Sellers /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/seller/:id", element: <UserDetails /> },
    { path: "/agent-agent-packages", element: <AgentPackages /> },
    { path: "/seller/:bussiness_id/products", element: <Products /> },
    { path: "/collections", element: <Routes /> },
    { path: "/packages", element: <Packages /> },
    { path: "/riders", element: <Riders /> },
    { path: "/mpesa-payments", element: <Payments /> },
    { path: "/tracks", element: <Tracks /> },
    { path: "/wahehouse", element: <WareHouse /> },
    { path: "/wahehouse/:slug", element: <WareHouseActions /> },
    { path: "/wahehouse/assign/:rider", element: <Riderpage /> },
    { path: "/wahehouse/doorstep/packages", element: <WHdoorstep /> },
    { path: "/wahehouse/doorstep/pick-packages", element: <PickFromRider /> },
    { path: "/wahehouse/doorstep/pick-packages-from/:rider", element: <PickFromRiderPage /> },
    { path: "/wahehouse/doorstep/give-package-to-rider", element: <GIvetoRiderPage /> },
    { path: "/wahehouse/doorstep/assign-rider", element: <AsRiderPage /> },

    { path: "/track/:riders", element: <AssignRider /> },
    { path: "/wahehouse/agent-agent/packages", element: <WHAgent /> },
    { path: "/wahehouse/agent-agent/assign-rider", element: <Assign_Agent_package_riderWareHouse /> },

    { path: "/agents", element: <Agents /> },
    { path: "/agent/:name", element: <AgentsDetails /> },

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
