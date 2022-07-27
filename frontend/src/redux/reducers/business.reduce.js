const initialState = {
  bussiness: {},
  errors: [],
  error: "",
  bussinsses: [],
  loading: false,
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case "FETCH_BUSSINESS":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_BUSSINESS_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        bussinsses: action.payload,
      };
    case "FETCH_BUSSINESS_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };


    default:
      return state;
  }
}
