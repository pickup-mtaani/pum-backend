import axios, { setAuthToken } from "./axiosService";

export const getParcels = (data1) => async (dispatch) => {

  try {
    const { limit, state } = data1
    dispatch({ type: "FETCH_TODOS" });
    let payload = [];
    const { data } = await axios.get(`/api/packages?limit=${limit}&state=${state}`);
    payload = data;
    console.log(data);
    dispatch({ type: "FETCH_TODOS_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error)
  }
};
export const getBissinessParcels = (id) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_TODOS" });
    let payload = [];
    const { data } = await axios.get(`/api/packages/${id}`);
    payload = data;
    dispatch({ type: "FETCH_TODOS_SUCCESSFUL", payload });
    return;
  } catch (error) { }
};

export const recieve = (id) => async (dispatch) => {
  try {
    await setAuthToken(axios);
    dispatch({ type: "RECIEVE_PACKAGE" });

    const response = await axios.post(`/api/package/${id}/recieve`);
    let payload = [];
    payload = response;
    dispatch({ type: "RECIEVE_PACKAGE_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    ;
    let payload = "";
    if (error.response === undefined) {
      payload = "timeout";
      dispatch({ type: "RECIEVE_PACKAGE_FAIL", payload });
      throw error;
    } else {
      var obj = error.response.data;
      payload =
        error.response && error.response.data.message
          ? error.response.data.message
          : obj[Object.keys(obj)[0]];
      dispatch({ type: "RECIEVE_PACKAGE_FAIL", payload });
      throw error;
    }
  }
};
export const collect = (id, data) => async (dispatch) => {
  try {
    await setAuthToken(axios);
    dispatch({ type: "RECIEVE_PACKAGE" });

    const response = await axios.post(`/api/package/${id}/collect`, data);
    let payload = [];
    payload = response;
    dispatch({ type: "RECIEVE_PACKAGE_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    ;
    let payload = "";
    if (error.response === undefined) {
      payload = "timeout";
      dispatch({ type: "RECIEVE_PACKAGE_FAIL", payload });
      throw error;
    } else {
      var obj = error.response.data;
      payload =
        error.response && error.response.data.message
          ? error.response.data.message
          : obj[Object.keys(obj)[0]];
      dispatch({ type: "RECIEVE_PACKAGE_FAIL", payload });
      throw error;
    }
  }
};

export const reject = (id, data) => async (dispatch) => {
  try {

    await setAuthToken(axios);
    dispatch({ type: "REJECT_PACKAGE" });

    const response = await axios.post(`/api/package/${id}/reject`, data);
    let payload = [];
    payload = response;
    dispatch({ type: "REJECT_PACKAGE_SUCCESSFUL", payload });

    return payload;
  } catch (error) {
    let payload = "";
    if (error.response === undefined) {
      payload = "timeout";
      dispatch({ type: "REJECT_PACKAGE_FAIL", payload });
      throw error;
    } else {
      var obj = error.response.data;
      payload =
        error.response && error.response.data.message
          ? error.response.data.message
          : obj[Object.keys(obj)[0]];
      dispatch({ type: "REJECT_PACKAGE_FAIL", payload });
      throw error;
    }
  }
};

export const postPackage = (data) => async (dispatch) => {

  try {
    dispatch({ type: "ADD_PACKAGE" });
    const response = await axios.post(`/api/package`, data);
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

    const response = await axios.delete(`/api/todos/${id}`);
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
