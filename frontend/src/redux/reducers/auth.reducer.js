const initialState = {
  errors: [],
  error: "",
  user: {},
  loading: true,
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        loading: true,
      };
    case "LOGIN_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        user:action.payload
      };
    case "LOGIN_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };

    case "REGISTER_USER":
      return {
        ...state,
        loading: true,
      };
    case "REGISTER_USER_SUCCESSFUL":
      return {
        ...state,
        loading: false,
      };
    case "REGISTER_USER_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };
    case "CLEAR":
      return {
        ...state,
        loading: false,
        error: "",
      };

    default:
      return state;
  }
}
