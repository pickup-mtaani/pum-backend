import packageReducer from "./package.reduce";
import AuthReducer from "./auth.reducer";
import LocationReducer from "./location.reduce";
import ProductReducer from "./product.reduce";
import BussinessReducer from "./business.reduce";

import RidersReducer from "./riders.reducer";
const baseReduce = {
  PackageDetails: packageReducer,
  userDetails: AuthReducer,
  LocationDetail: LocationReducer,
  products: ProductReducer,
  bussiness: BussinessReducer,
  ridersDetails:RidersReducer
};

export default baseReduce;
