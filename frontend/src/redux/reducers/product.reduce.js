const initialState = {
  products: [],
  errors: [],
  error: "",
  packages: [],
  product: {},
  loading: false,
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case "FETCH_PRODUCT":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_PRODUCT_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        product: action.payload,
      };
    case "FETCH_PRODUCT_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };

    case "FETCH_PRODUCTS":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_PRODUCTS_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        products: action.payload,
      };
    case "FETCH_PRODUCTS_FAIL":
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
