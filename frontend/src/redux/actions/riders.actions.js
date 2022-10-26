
import axios, { setAuthToken } from "./axiosService";

export const get_riders = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_RIDERS" });
        const { data } = await axios.get(`/api/riders`);
        let payload = [];
        payload = data.riders;
        console.log(JSON.stringify(payload));
        dispatch({ type: "FETCH_RIDERS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_RIDERS_FAIL" });
        ;
    }
};
export const assignAgent = (id, agent) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        const { data } = await axios.put(`/api/assign-agent-rider/${id}/${agent}`);
        let payload = [];

        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};

export const get_payments = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_PAYMENTS" });
        const { data } = await axios.get(`/api/mpesa-payments`);
        let payload = [];
        payload = data.mpeslog;
        dispatch({ type: "FETCH_PAYMENTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};

export const assignRider = (data1) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_PAYMENTS" });
        const { data } = await axios.post(`/api/assign-riders`, data1);
        let payload = [];
        payload = data.mpeslog;
        dispatch({ type: "FETCH_PAYMENTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};

export const fetchpackages = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_PAYMENTS" });
        const { data } = await axios.get(`/api/assigned-packages/${id}`);
        let payload = [];
        console.log(data)
        payload = data.packages;
        dispatch({ type: "FETCH_PAYMENTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};


// assigned-packages

