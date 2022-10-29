import { $CombinedState } from "redux";
import axios, { setAuthToken } from "./axiosService";

export const getParcels = (data1) => async (dispatch) => {

  try {
    const { limit, state } = data1
    dispatch({ type: "FETCH_TODOS" });
    let payload = [];
    const { data } = await axios.get(`/api/packages?limit=${limit}&state=${state}`);
    payload = data;
    //alert(JSON.stringify(payload));
    dispatch({ type: "FETCH_TODOS_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error)
  }
};


export const getdoorstep = (data1) => async (dispatch) => {

  try {
    const { limit, state } = data1
    dispatch({ type: "FETCH_DOORSTEP" });
    let payload = [];
    const { data } = await axios.get(`/api/packages?limit=${limit}&state=${state}`);
    payload = data;
    dispatch({ type: "FETCH_DOORSTEP_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error)
  }
};

export const assignwarehouse = (id, state, rider) => async (dispatch) => {

  try {

    dispatch({ type: "FETCH_DOORSTEP" });
    let payload = [];
    const { data } = await axios.put(`/api/agent/package/${id}/${state}?rider=${rider}`);
    payload = data;
    dispatch({ type: "FETCH_DOORSTEP_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error)
  }
};

export const togglePayment = (id, type) => async (dispatch) => {

  try {

    dispatch({ type: "FETCH_DOORSTEP" });
    let payload = [];
    const { data } = await axios.put(`/api/${type}/toogle-payment/${id}`);
    payload = data;
    dispatch({ type: "FETCH_DOORSTEP_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error)
  }
};
export const getagentParcels = () => async (dispatch) => {

  try {
    await setAuthToken(axios);
    dispatch({ type: "FETCH_AGENTS_PACKAGES" });
    let payload = [];

    const response = await axios.get(`/api/web/all-agent-packages/packages`);

    payload = response;
    dispatch({ type: "FETCH_AGENTS_PACKAGES_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error)
  }
};

export const getagentPackage = (id) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_AGENTS_PACK" });
    let payload = [];
    const { data } = await axios.get(`/api/packages/agent/${id}`);
    payload = data.packages;
    dispatch({ type: "FETCH_AGENTS_PACK_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error)
  }
};
export const getBissinessParcels = (id) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_TODOS" });
    let payload = [];
    const { data } = await axios.get(`/ api / packages / ${id}`);
    payload = data;
    dispatch({ type: "FETCH_TODOS_SUCCESSFUL", payload });
    return;
  } catch (error) { }
};


export const postPackage = (data) => async (dispatch) => {

  try {
    dispatch({ type: "ADD_PACKAGE" });
    const response = await axios.post(`/ api / package`, data);
    let payload = [];
    payload = response;
    dispatch({ type: "ADD_PACKAGE_SUCCESSFUL", payload });
    return payload;
  } catch (error) {

    dispatch({ type: "ADD_PACKAGE_FAIL", error });
    throw error;

  }
};

export const deleteTodo = (id) => async (dispatch) => {
  try {
    dispatch({ type: "DELETE_TODO" });

    const response = await axios.delete(`/ api / todos / ${id}`);
    let payload = [];
    payload = response;
    dispatch({ type: "DELETE_TODO_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    let payload = "";
    if (error.response === undefined) {
      payload = "timeout";
      dispatch({ type: "DELETE_TODO_FAIL", payload });
      throw error;
    } else {

      throw error;
    }
  }
};
