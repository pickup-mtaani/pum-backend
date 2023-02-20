const initialState = {
  locations: [],

  errors: [],
  error: "",
  packages: [],
  loading: true,
};

export default function store(state = initialState, action) {
  switch (action.type) {

    case "FETCH_LOCATION":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_LOCATION_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        locations: action.payload,
      };
    case "FETCH_LOCATION_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };
    case "ADD_THRIFT":
      return {
        ...state,
        loading: true,
      };
    case "ADD_THRIFT_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        locations: action.payload,
      };
    case "ADD_THRIFT_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };

    default:
      return state;
  }
}
