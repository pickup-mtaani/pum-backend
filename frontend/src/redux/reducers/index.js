import packageReducer from "./package.reduce";
import AuthReducer from "./auth.reducer";
import LocationReducer from "./location.reduce";
const baseReduce = {
  PackageDetails: packageReducer,
  userDetails: AuthReducer,
  LocationDetail:LocationReducer
};

export default baseReduce;
