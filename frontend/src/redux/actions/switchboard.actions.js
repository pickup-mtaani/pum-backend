
import axios, { setAuthToken } from "./axiosService";

export const get_agent_tracks = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_SELLER_PRODUCTS" });
        const { data } = await axios.get(`/api/all_products/${id}`);
        let payload = [];
        payload = data.products;
        dispatch({ type: "FETCH_PRODUCTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_SELLER_PRODUCTS_FAIL" });
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
        ;
    }
};

export const get_single_product = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_PRODUCT" });
        const { data } = await axios.get(`/api/product/${id}`);
        let payload = data.prod;
        dispatch({ type: "FETCH_PRODUCT_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_PRODUCT_FAIL" });
        ;
    }
};