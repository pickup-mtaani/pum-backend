
import axios, { setAuthToken } from "./axiosService";

export const get_riders = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_RIDERS" });
        const { data } = await axios.get(`/api/riders`);
        let payload = [];
        payload = data.riders;
        dispatch({ type: "FETCH_RIDERS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_RIDERS_FAIL" });
        ;
    }
};

