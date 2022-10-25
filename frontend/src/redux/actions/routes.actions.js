
import axios, { setAuthToken } from "./axiosService";

export const get_routes = () => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_ROUTES_SUCCESSFUL" });
        const { data } = await axios.get(`/api/collectors`);
        let payload = [];
        console.log(data)
        payload = data
        dispatch({ type: "FETCH_ROUTES_SUCCESSFUL", payload });

        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_RIDERS_FAIL" });
        ;
    }
};
// export const get_zones = () => async (dispatch) => {

//     try {
//         await setAuthToken(axios);
//         const { data } = await axios.get(`/api/zones`);
//         let payload = [];
//         payload = data?.Zones;
//         return payload;
//     } catch (error) {
//         console.log(error)
//         dispatch({ type: "FETCH_RIDERS_FAIL" });
//         ;
//     }
// };
export const Post = (data) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        const res = await axios.post(`/api/routes`, data);

        return;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_RIDERS_FAIL" });
        ;
    }
};


// assigned-packages

