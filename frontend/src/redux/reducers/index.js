import packageReducer from "./package.reduce";
import AuthReducer from "./auth.reducer";
import LocationReducer from "./location.reduce";
import ProductReducer from "./product.reduce";

const baseReduce = {
  PackageDetails: packageReducer,
  userDetails: AuthReducer,
  LocationDetail: LocationReducer,
  products: ProductReducer
};

export default baseReduce;
