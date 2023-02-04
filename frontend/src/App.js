import React from "react";
import Login from "./login";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Sellers from "./components/Seller";
import UserDetails from "./components/Seller/UserDetails";
import Products from "./components/Seller/products";
import Packages from "./components/packages";
import AgentPackages from "./components/packages/aent";
import Riders from "./components/Riders";
import Payments from "./components/payment";
// import Tracks from "./components/tracks ";
import WareHouse from "./components/warehouse";
import Assign_Agent_package_riderWareHouse from "./components/warehouse/agent/assignRider";
import Agents from "./components/agents ";
import WHdoorstep from "./components/warehouse/doorstep";
import PickFromRider from "./components/warehouse/doorstep/pick";
import PickFromRiderPage from "./components/warehouse/doorstep/riderpage";
import PickFromAgentRider from "./components/warehouse/agent/pickPackage";
import RiderAgents from "./components/warehouse/agent/agents";
import GIvetoRiderPage from "./components/warehouse/doorstep/give";
import AsRiderPage from "./components/warehouse/doorstep/assignRider";

import WereHouseErrands from "./components/warehouse/errand/";
import PickErrandFromRider from "./components/warehouse/errand/pick";
import PickErrandFromRiderPage from "./components/warehouse/errand/riderpage";
import GiveErrandtoRiderPage from "./components/warehouse/errand/give";
import AssignErrandRiderPage from "./components/warehouse/errand/give";

import WHAgent from "./components/warehouse/agent";
import Collections from "./components/routes";
import WareHouseActions from "./components/warehouse/actionPage";

import Riderpage from "./components/warehouse/riderpage";
import AgentsDetails from "./components/AgentsDetails";
import SwitchBoard from "./components/packages/switchboard";
import AssignRider from "./components/TrackRider";

import Bussiness from "./components/bussiness";

import RentShelf from "./components/rentshelf";
import RentShelfAgents from "./components/rentshelf/business";
import RentShelfAgent from "./components/rentshelf/details";

import Setup from "./components/Setup";
import Withdrawals from "./screens/mpesa/Withdrawals";
const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/sellers", element: <Sellers /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/seller/:id", element: <UserDetails /> },
    { path: "/agent-agent-packages", element: <AgentPackages /> },
    { path: "/seller/:bussiness_id/products", element: <Products /> },
    { path: "/collections", element: <Collections /> },
    { path: "/packages", element: <Packages /> },
    { path: "/riders", element: <Riders /> },
    { path: "/mpesa-payments", element: <Payments /> },

    { path: "/rent-a-shelf", element: <RentShelf /> },
    { path: "/rent-a-shelf/:shop/businesses", element: <RentShelfAgents /> },
    {
      path: "/rent-a-shelf/:shop/business/:business",
      element: <RentShelfAgent />,
    },

    // { path: "/tracks", element: <Tracks /> },
    { path: "/wahehouse", element: <WareHouse /> },
    { path: "/wahehouse/:slug", element: <WareHouseActions /> },
    { path: "/wahehouse/assign/:rider", element: <Riderpage /> },

    {
      path: "/wahehouse/agent-agent/pick-package-from-rider/:rider",
      element: <PickFromAgentRider />,
    },
    { path: "/wahehouse/agent-agent/packages", element: <WHAgent /> },
    {
      path: "/wahehouse/agent-agent/assign-package-to/:rider",
      element: <Assign_Agent_package_riderWareHouse />,
    },
    { path: "/wahehouse/agent-agent/:slug/agents", element: <RiderAgents /> },

    { path: "/wahehouse/doorstep/packages", element: <WHdoorstep /> },
    { path: "/wahehouse/doorstep/pick-packages", element: <PickFromRider /> },
    {
      path: "/wahehouse/doorstep/pick-packages-from/:rider",
      element: <PickFromRiderPage />,
    },
    {
      path: "/wahehouse/doorstep/give-package-to-rider",
      element: <GIvetoRiderPage />,
    },
    { path: "/wahehouse/doorstep/assign-rider", element: <AsRiderPage /> },

    { path: "/business", element: <Bussiness /> },

    { path: "/wahehouse/errand/packages", element: <WereHouseErrands /> },
    {
      path: "/wahehouse/errand/pick-packages",
      element: <PickErrandFromRider />,
    },
    {
      path: "/wahehouse/errand/pick-packages-from/:rider",
      element: <PickErrandFromRiderPage />,
    },
    {
      path: "/wahehouse/errand/give-package-to-rider",
      element: <GiveErrandtoRiderPage />,
    },
    {
      path: "/wahehouse/errand/assign-rider",
      element: <AssignErrandRiderPage />,
    },

    { path: "/setup", element: <Setup /> },

    { path: "/switch-board", element: <SwitchBoard /> },
    { path: "/track/:riders", element: <AssignRider /> },

    { path: "/agents", element: <Agents /> },
    { path: "/agent/:name", element: <AgentsDetails /> },

    { path: "/mpesa/withdrawals", element: <Withdrawals /> },

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
