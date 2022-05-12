const initialState = {
  package: {},
  errors: [],
  error: "",
  packages: [],
  loading: true,
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case "RECIEVE_PACKAGE":
      return {
        ...state,
        loading: true,
      };
    case "RECIEVE_PACKAGE_SUCCESSFUL":
      return {
        ...state,
        loading: false,
      };
    case "RECIEVE_PACKAGE_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };

      case "REJECT_PACKAGE":
        return {
          ...state,
          loading: true,
        };
      case "REJECT_PACKAGE_SUCCESSFUL":
        return {
          ...state,
          loading: false,
        };
      case "REJECT_PACKAGE_FAIL":
        return {
          ...state,
          loading: true,
          error: action.payload,
        };
  
    case "ADD_PACKAGE":
      return {
        ...state,
        loading: true,
      };
    case "ADD_PACKAGE_SUCCESSFUL":
      return {
        ...state,
        loading: false,
      };
    case "ADD_PACKAGE_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };
    case "DELETE_TODO":
      return {
        ...state,
        loading: true,
      };
    case "DELETE_TODO_SUCCESSFUL":
      return {
        ...state,
        loading: false,
      };
    case "DELETE_TODO_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };
    case "FETCH_TODOS":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_TODOS_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        packages: action.payload,
      };
    case "FETCH_TODOS_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };

    default:
      return state;
  }
}
