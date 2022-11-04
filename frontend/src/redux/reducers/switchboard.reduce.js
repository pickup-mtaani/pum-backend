const initialState = {
  package: {},
  errors: [],
  error: "",
  packages: [],
  to_door_packages: [],
  shelf_packages_tracks: [],
  agent_packages_tracks: [],
  agentloading: true,
  doorloading: true,
  loading: true,
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case "FETCH_RENT_SHELF":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_RENT_SHELF_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        shelf_packages_tracks: action.payload
      };
    case "FETCH_RENT_SHELF_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };
    case "FETCH_AGENT":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_AGENT_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        agent_packages_tracks: action.payload
      };
    case "FETCH_AGENT_FAIL":
      return {
        ...state,
        loading: true,
        error: action.payload,
      };



    default:
      return state;
  }
}
