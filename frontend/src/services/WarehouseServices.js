import AxiosUtility, { setAuthToken } from "../redux/actions/axiosService";

/**
 * METHOD: GET
 * @returns warehouse packages count
 */
const getWarehouseCount = async () => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.get(`/api/packages/warehouse-package-count`);

  return res?.data;
};

/**
 * METHOD: GET
 * ARGS: rider_id, package_state
 * @returns warehouse agent packages to collect
 */
const getWarehouseAgentPackages = async (r_id, state) => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.get(
    `/api/warehouse/collect/agent?rider=${r_id}&state=${state}`
  );

  return res?.data;
};

/**
 * METHOD: GET
 * ARGS: rider_id, package_state
 * @returns warehouse doorstep packages to collect
 */
const getWarehouseDoorstepPackages = async (r_id, state) => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.get(
    `/api/warehouse/collect/doorstep?rider=${r_id}&state=${state}`
  );

  return res?.data;
};

/**
 * METHOD: GET
 * ARGS: rider_id, package_state
 * @returns warehouse Errand packages to collect
 */
const getWarehouseErrandPackages = async (r_id, state) => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.get(
    `/api/warehouse/collect/errand?rider=${r_id}&state=${state}`
  );

  return res?.data;
};

const WarehouseServices = {
  getWarehouseCount,
  getWarehouseAgentPackages,
  getWarehouseDoorstepPackages,
  getWarehouseErrandPackages,
};
export default WarehouseServices;
