import RiderServices from "../../services/RiderServices";

export const fetchCoordinates = (ids) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_COORDINATES" });

    const response = await RiderServices.getCoordinates(ids);

    let payload = response?.paths;
    dispatch({ type: "FETCH_COORDINATES_SUCCESSFUL", payload });
    return payload;
  } catch (error) {
    dispatch({ type: "FETCH_COORDINATES_ERROR", payload: error });
  }
};

export const update_rider_data = (update) => {
  return {
    type: "UPDATE_RIDER",
    payload: update,
  };
};
