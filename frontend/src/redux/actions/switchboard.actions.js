
import axios, { setAuthToken } from "./axiosService";

export const get_agent_tracks = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_AGENT" });
        const { data } = await axios.get(`/api/agent/track/packages`);
        let payload = [];
        payload = data;
        dispatch({ type: "FETCH_AGENT_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_AGENT_FAIL" });
        ;
    }
};

export const get_rent_shelf_tracks = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_RENT_SHELF" });
        const { data } = await axios.get(`/api/rent-shelf/track/packages`);
        let payload = [];
        payload = data;
        dispatch({ type: "FETCH_RENT_SHELF_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_RENT_SHELF_FAIL" });

    }
};
export const get_door_step_tracks = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_DOOR_STEP" });
        const { data } = await axios.get(`/api/door-step/track/packages`);
        let payload = [];
        payload = data;
        dispatch({ type: "FETCH_DOOR_STEP_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_DOOR_STEP_FAIL" });
        ;
    }
};

