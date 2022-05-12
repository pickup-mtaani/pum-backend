import axios, { setAuthToken } from "./axiosService";

export const getlocations = () => async (dispatch) => {
  try {
await setAuthToken(axios);
    dispatch({ type: "FETCH_LOCATION" });
    let payload = [];
    const response = await axios.get(`/api/thrifter_location`);
    const { data } = response;
    payload = data.locations;
    dispatch({ type: "FETCH_LOCATION_SUCCESSFUL", payload });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const addthrift = ( data) => async (dispatch) => {
  try {
    await setAuthToken(axios);
    dispatch({ type: "ADD_THRIFT" });
    const response = await axios.post(`/api/thrifter`, data);
    
    let payload = [];
    payload = response;
    dispatch({ type: "ADD_THRIFT_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    console.log(error);
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

export const updateTodo = (id, data) => async (dispatch) => {

  try {
    dispatch({ type: "UPDATE_TODO" });
    const response = await axios.put(`/api/todos/${id}`, data);
    let payload = [];
    payload = response;
    dispatch({ type: "UPDATE_TODO_SUCCESSFUL", payload });
    return payload;
  } catch (error) {

    dispatch({ type: "UPDATE_TODO_FAIL", error });
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
