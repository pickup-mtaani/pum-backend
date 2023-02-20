import AxiosUtility, { setAuthToken } from "../redux/actions/axiosService";

const fetchWithdrawals = async () => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.get(`/api/withdrawals/request`);

  return res?.data;
};

const updateWithdrawal = async (id, data) => {
  await setAuthToken(AxiosUtility);

  let res = await AxiosUtility.patch(`/api/withdrawals/request/${id}`, data);

  return res?.data;
};

const withdrawalServices = {
  fetchWithdrawals,
  updateWithdrawal,
};
export default withdrawalServices;
