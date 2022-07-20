
import axios, { setAuthToken } from "./axiosService";

export const get_seller_products = (id) => async (dispatch) => {

    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_SELLER_PRODUCTS" });
        const { data } = await axios.get(`/api/products/${id}`);
        let payload = [];
        payload = data.products;
        dispatch({ type: "FETCH_SELLER_PRODUCTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_SELLER_PRODUCTS_FAIL" });
        ;
    }
};

export const get_all_products = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_PRODUCTS" });
        const { data } = await axios.get(`/api/productsiness/${id}`);
        let payload = [];
        payload = data.products;
        dispatch({ type: "FETCH_PRODUCTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_PRODUCTS_FAIL" });
        ;
    }
};