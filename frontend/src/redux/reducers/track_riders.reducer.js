const initialState = {
  coordinates: {},
  loading: false,
  error: "",
};

export default function tracker(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_RIDER":
      return {
        ...state,
        coordinates: {
          ...state?.coordinates,
          [action.payload?.id]: action.payload?.data,
        },
      };
    case "FETCH_COORDINATES":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_COORDINATES_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        coordinates: action.payload,
      };
    case "FETCH_COORDINATES_ERROR":
      return {
        ...state,
        loading: false,
        error: action?.payload,
      };

    default:
      return state;
  }
}
