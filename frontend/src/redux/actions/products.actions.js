
import axios, { setAuthToken } from "./axiosService";

export const get_seller_products = (id) => async (dispatch) => {
  
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_SELLER_PRODUCTS" });
        const { data } = await axios.get(`/api/products/${id}`);
        console.log(data.products)
        let payload = [];
        payload = data.products;
        dispatch({ type: "FETCH_SELLER_PRODUCTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_SELLER_PRODUCTS_FAIL" });
        console.log(error);
    }
};

export const get_all_products = (id) => async (dispatch) => {
    try {
        await setAuthToken(axios);
        dispatch({ type: "FETCH_PRODUCTS" });
        const { data } = await axios.get(`/api/productsiness/${id}`);
        console.log(data.products)
        let payload = [];
        payload = data.products;
        dispatch({ type: "FETCH_PRODUCTS_SUCCESSFUL", payload });
        return payload;
    } catch (error) {
        dispatch({ type: "FETCH_PRODUCTS_FAIL" });
        console.log(error);
    }
};