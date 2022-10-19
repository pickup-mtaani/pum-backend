
import axios, { setAuthToken } from "./axiosService";

export const get_routes = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_RIDERS" });
        const { data } = await axios.get(`/api/routes`);
        let payload = [];
        payload = data
        dispatch({ type: "FETCH_RIDERS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_RIDERS_FAIL" });
        ;
    }
};
export const get_zones = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_RIDERS" });
        const { data } = await axios.get(`/api/zones`);
        let payload = [];
        payload = data?.Zones;
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_RIDERS_FAIL" });
        ;
    }
};
export const Post = (data) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_RIDERS" });
        const res = await axios.post(`/api/routes`, data);
        alert(res)
        return;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_RIDERS_FAIL" });
        ;
    }
};


// assigned-packages

