import AxiosUtility, { setAuthToken } from "../redux/actions/axiosService";

const getRiders = async () => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.get(`/api/all_riders`);

  return res?.data;
};

// get rider coordinates
// pass an array of user id's to fetch each rider's latest coordinates
const getCoordinates = async (d) => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.post("/api/rider_path", { riders: d });

  return res?.data;
};

const getCurrentRiderCoordinates = async (id) => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.get("/api/rider_path/" + id);

  return res?.data;
};

const RiderServices = {
  getRiders,
  getCoordinates,
  getCurrentRiderCoordinates,
};
export default RiderServices;
