
import axios, { setAuthToken } from "./axiosService";

export const get_agents = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_AGENTS" });
        const { data } = await axios.get(`/api/agents`);
        let payload = [];
        payload = data.agents;
        //alert(JSON.stringify(payload))
        dispatch({ type: "FETCH_AGENTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_AGENTS_FAIL" });
        ;
    }
};
export const get_zones = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_ZONES" });
        const { data } = await axios.get(`/api/zones`);
        let payload = [];
        payload = data.Zones;
        //alert(JSON.stringify(data))
        dispatch({ type: "FETCH_ZONES_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_ZONES_FAIL" });
        ;
    }
};

export const assign = (id, zone) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        const { data } = await axios.put(`/api/assign-zone/${id}?zone=${zone}`);
        let payload = [];

        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};

export const fetchpackages = (state, agent) => async (dispatch) => {
    //alert(JSON.stringify(agent))
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_WEBPACKAGES" });
        const { data } = await axios.get(`/api/agent-packages-web?state=${state}&agent=${agent ? agent : "all"}`);
        let payload = [];
        payload = data.packages;

        dispatch({ type: "FETCH_WEBPACKAGES_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_WEBPACKAGES_FAIL" });
        ;
    }
};

export const fetchdoorpackages = (state, agent) => async (dispatch) => {
    //alert(JSON.stringify(agent))
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_WEBPACKAGES" });
        const { data } = await axios.get(`/api/door-step-packages?state=${state}&agent=${agent ? agent : "all"}`);
        let payload = [];
        payload = data.packages;

        dispatch({ type: "FETCH_WEBPACKAGES_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_WEBPACKAGES_FAIL" });
        ;
    }
};
// export const fetchpackages = (id) => async (dispatch) => {

//     try {

//         await setAuthToken(axios);
//         dispatch({ type: "FETCH_PAYMENTS" });
//         const { data } = await axios.get(`/ api / assigned - packages / ${ id }`);
//         let payload = [];
//         console.log(data)
//         payload = data.packages;
//         dispatch({ type: "FETCH_PAYMENTS_SUCCESSFUL", payload });
//         return payload;
//     } catch (error) {
//         console.log(error)
//         dispatch({ type: "FETCH_PAYMENTS_FAIL" });
//         ;
//     }
// };


// assigned-packages

