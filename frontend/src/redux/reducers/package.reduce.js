const initialState = {
  package: {},
  errors: [],
  error: "",
  packages: [],
  to_door_packages: [],
  rented_shelf_packages: [],
  agentloading: true,
  doorloading: true,
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
    case "FETCH_AGENTS_PACKAGES":
      return {
        ...state,
        agentloading: true,
      };
    case "FETCH_AGENTS_PACKAGES_SUCCESSFUL":
      return {
        ...state,
        agentloading: false,
        packages: action.payload.agent_packages,
      };
    case "FETCH_AGENTS_PACKAGES_FAIL":
      return {
        ...state,
        agentloading: true,
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

        rented_shelf_packages: action.payload.shelves
      };
    case "FETCH_TODOS_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };
    case "FETCH_DOORSTEP":
      return {
        ...state,
        doorloading: true,
      };
    case "FETCH_DOORSTEP_SUCCESSFUL":
      return {
        ...state,
        doorloading: false,
        to_door_packages: action.payload.doorstep_packages,

      };
    case "FETCH_DOORSTEP_FAIL":
      return {
        ...state,
        doorloading: true,
        error: action.payload,
      };

    default:
      return state;
  }
}
