
import axios, { setAuthToken } from "./axiosService";

export const get_seller_bussiness = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_BUSSINESS" });
        const { data } = await axios.get(`/api/business/${id}`);
        let payload = [];
        payload = data.Bus;
        dispatch({ type: "FETCH_BUSSINESS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        ;
    }
};

