
import axios, { setAuthToken } from "./axiosService";

export const get_seller_bussiness = (id) => async (dispatch) => {

    try {

        await setAuthToken(axios);
        dispatch({ type: "FETCH_BUSSINESS" });
        const { data } = await axios.get(`/api/busi/${id}`);
        let payload = [];
        payload = data.bussiness;

        dispatch({ type: "FETCH_BUSSINESS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        let payload = "";
        dispatch({ type: "FETCH_BUSSINESS_FAIL", payload });
    }
};
export const get_business = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_AGENTS" });
        const { data } = await axios.get(`/api/all-businesses`);
        let payload = [];
        payload = data.bussiness;

        dispatch({ type: "FETCH_AGENTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_AGENTS_FAIL" });
        ;
    }
};
export const activateShelf = (id) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_AGENTS" });
        const { data } = await axios.put(`/api/activate-shelf/${id}`);
        let payload = [];
        payload = data.bussiness;

        dispatch({ type: "FETCH_AGENTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_AGENTS_FAIL" });
        ;
    }
};

