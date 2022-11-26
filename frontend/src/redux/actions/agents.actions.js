
import axios, { setAuthToken } from "./axiosService";

export const get_agents = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_AGENTS" });
        const { data } = await axios.get(`/api/agents?location=`);
        let payload = [];
        payload = data.agents;

        dispatch({ type: "FETCH_AGENTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_AGENTS_FAIL" });
        ;
    }
};
export const delete_agents = (id) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        const payload = await axios.delete(`/api/delete-agent/${id}`);

        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_AGENTS_FAIL" });
        ;
    }
};
export const get_agents_employees = (id) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        const { data } = await axios.get(`/api/admin/all-employees/${id}`);

        return data;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_AGENTS_FAIL" });
        ;
    }
};
export const activate_agents = (id) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        const { data } = await axios.put(`/api/activate_agent/${id}`);

        return data;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_AGENTS_FAIL" });
        ;
    }
};
export const activate_user = (id) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        const { data } = await axios.put(`/api/user/${id}/activate-user`);

        return data;
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

export const assign = (id, agent) => async (dispatch) => {
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
export const agents = () => async (dispatch) => {
    try {
        await setAuthToken(axios);
        const { data } = await axios.get(`/api/agents_routes`);

        return data;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};
export const Rideagents = (id) => async (dispatch) => {
    try {

        await setAuthToken(axios);
        const { data } = await axios.get(`/api/agents/${id}`);

        return data;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};

export const CollectDoorStep = (id, state, assignedTo) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        const { data } = await axios.put(`/api/door-step/package/${id}/${state}?assignedTo=${assignedTo}`);
        let payload = [];
        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_PAYMENTS_FAIL" });
        ;
    }
};


export const add_employee = (id, data, role) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        await axios.post(`/api/admin/add-user-to-agent/${id}?role=${role}`, data);

        return;
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
export const fetchdoorpack = (state) => async (dispatch) => {
    //alert(JSON.stringify(agent))
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_WEBPACKAGES" });
        const { data } = await axios.get(`/api/wh-door-step-packages?state=${state}`);
        let payload = [];

        dispatch({ type: "FETCH_WEBPACKAGES_SUCCESSFUL", payload });
        return data;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_WEBPACKAGES_FAIL" });
        ;
    }
};

export const fetchAgentpack = (state) => async (dispatch) => {
    //alert(JSON.stringify(agent))
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_WEBPACKAGES" });
        const { data } = await axios.get(`/api/agents-packages-recieved-warehouse?agent=${state}`);
        let payload = [];

        dispatch({ type: "FETCH_WEBPACKAGES_SUCCESSFUL", payload });
        return data;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_WEBPACKAGES_FAIL" });
        ;
    }
};

export const fetchdoorpackages = (state, id) => async (dispatch) => {
    //alert(JSON.stringify(agent))
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_WEBPACKAGES" });
        const { data } = await axios.get(`/api/wh-door-step-packages/${id}?state=${state}`);
        let payload = [];

        dispatch({ type: "FETCH_WEBPACKAGES_SUCCESSFUL", payload });
        return data;
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

