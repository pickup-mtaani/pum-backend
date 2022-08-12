import axios, { setAuthToken } from "./axiosService";

export const loginUser = (dat) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN" });
    const { data } = await axios.post(`/api/admin/login`, dat);
    localStorage.setItem("userInfo", JSON.stringify(data));
    let payload = data;
    dispatch({ type: "LOGIN_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    alert(error)
    // let payload = error.response.data.message;
    // dispatch({ type: "LOGIN_FAIL", payload });

    throw error;
  }
};
export const AuthUser = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/user/${id}`);
    let payload = data.userObj
    dispatch({ type: "LOGIN_SUCCESSFUL", payload });
  } catch (error) {

  }
}
export const registerUser = (dat) => async (dispatch) => {
  try {
    await setAuthToken(axios)
    dispatch({ type: "REGISTER_USER" });
    const { data } = await axios.post(`/api/admin/register`, dat);
    let payload = data
    dispatch({ type: "REGISTER_USER_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    ;
    let payload = "error.response.data.message";
    dispatch({ type: "REGISTER_USER_FAIL", payload });
    throw error;
  }
};
export const FetchUsers = (dat) => async (dispatch) => {
  const { date } = dat
  try {
    await setAuthToken(axios)
    dispatch({ type: "FETCH_USERS" });
    const { data } = await axios.get(`/api/users?start_date=${date.start_date !== "" ? date.start_date : undefined}?end_date=${date.end_date !== "" ? date.end_date : undefined}`);
    let payload = data.Users
    dispatch({ type: "FETCH_USERS_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    ;
    let payload = "error.response.data.message";
    dispatch({ type: "FETCH_USERS_FAIL", payload });
    throw error;
  }
};
export const FetchAdmins = (dat) => async (dispatch) => {
  try {
    await setAuthToken(axios)
    dispatch({ type: "FETCH_ADMINS" });
    const { data } = await axios.get(`/api/admin?date=${dat !== undefined ? dat.date : ""}`);

    let payload = data.Admins
    dispatch({ type: "FETCH_ADMINS_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    ;
    let payload = "error.response.data.message";
    dispatch({ type: "FETCH_ADMINS_FAIL", payload });
    throw error;
  }
};
export const clearError = (dat) => async (dispatch) => {

  dispatch({ type: "CLEAR" });

};
