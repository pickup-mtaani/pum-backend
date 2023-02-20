
import axios, { setAuthToken } from "./axiosService";

export const get_destinations = (type) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_DESTINATIONS_SUCCESSFUL" });
        const { data } = await axios.get(`/api/doorstep-destinations`);
        let payload = [];

        payload = data
        dispatch({ type: "FETCH_DESTINATIONS_SUCCESSFUL", payload });

        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_DESTINATIONS_FAIL" });
        ;
    }
};
export const update_zone_prices = (data, id) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        await axios.put(`/api/zone_price/${id}`, data);
        let payload = [];
        return payload;
    } catch (error) {
        console.log(error)

    }
};
export const delete_zone_prices = (id) => async (dispatch) => {

    try {
        await setAuthToken(axios);

        await axios.put(`/api/zone_price/soft_delete/${id}`);
        let payload = [];
        return payload;
    } catch (error) {
        console.log(error)

    }
};
export const create_zone_prices = (data) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        await axios.post(`/api/zone_price`, data);
        let payload = [];
        return payload;
    } catch (error) {
        console.log(error)

    }
};
export const get_zone_prices = (type) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_ZONE_PRICING_SUCCESSFUL" });
        const { data } = await axios.get(`/api/zone_price`);
        let payload = [];

        payload = data
        dispatch({ type: "FETCH_ZONE_PRICING_SUCCESSFUL", payload });

        return payload;
    } catch (error) {
        console.log(error)
        dispatch({ type: "FETCH_ZONE_PRICING_FAIL" });
        ;
    }
};
// export const get_routes = () => async (dispatch) => {

//     try {
//         await setAuthToken(axios);
//         dispatch({ type: "FETCH_ROUTES_SUCCESSFUL" });
//         const { data } = await axios.get(`/api/collectors`);
//         let payload = [];
//         console.log(data)
//         payload = data
//         dispatch({ type: "FETCH_ROUTES_SUCCESSFUL", payload });

//         return payload;
//     } catch (error) {
//         console.log(error)
//         dispatch({ type: "FETCH_RIDERS_FAIL" });
//         ;
//     }
// };
// // export const get_zones = () => async (dispatch) => {

// //     try {
// //         await setAuthToken(axios);
// //         const { data } = await axios.get(`/api/zones`);
// //         let payload = [];
// //         payload = data?.Zones;
// //         return payload;
// //     } catch (error) {
// //         console.log(error)
// //         dispatch({ type: "FETCH_RIDERS_FAIL" });
// //         ;
// //     }
// // };
// export const Post = (data) => async (dispatch) => {
//     try {
//         await setAuthToken(axios);
//         const res = await axios.post(`/api/routes`, data);

//         return;
//     } catch (error) {
//         console.log(error)
//         dispatch({ type: "FETCH_RIDERS_FAIL" });
//         ;
//     }
// };


// assigned-packages

