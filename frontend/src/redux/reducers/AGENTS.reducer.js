const initialState = {
  zones: [],
  errors: [],
  error: "",
  agents: [],
  rs_agents: [],
  routes: [],
  packs: [],
  loading: false,
  warehouse: {
    agent: {},
    doorstep: {},
    errand: {},
  },
};

export default function store(state = initialState, action) {
  switch (action.type) {
    case "FETCH_PENDING":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_WAREHOUSE_DROPPED_AGENT_PACKAGES_SUCCESS":
      //   DROPPED WAREHOUSE ACTIONS
      return {
        ...state,
        loading: false,
        warehouse: {
          ...state?.warehouse,
          agent: action.payload,
        },
      };
    case "FETCH_WAREHOUSE_DROPPED_AGENT_PACKAGES_FAILED":
      return {
        ...state,
        loading: false,

        warehouse: {
          ...state?.warehouse,
          agent: {},
        },
      };

    case "FETCH_WAREHOUSE_DROPPED_DOORSTEP_PACKAGES_SUCCESS":
      return {
        ...state,
        loading: false,

        warehouse: {
          ...state?.warehouse,
          doorstep: action.payload,
        },
      };
    case "FETCH_WAREHOUSE_DROPPED_DOORSTEP_PACKAGES_FAILED":
      return {
        ...state,
        loading: false,

        warehouse: {
          ...state?.warehouse,
          doorstep: {},
        },
      };

    case "FETCH_WAREHOUSE_DROPPED_ERRAND_PACKAGES_SUCCESS":
      return {
        ...state,
        loading: false,

        warehouse: {
          ...state?.warehouse,
          errand: action.payload,
        },
      };
    case "FETCH_WAREHOUSE_DROPPED_ERRAND_PACKAGES_FAILED":
      return {
        ...state,
        loading: false,

        warehouse: {
          ...state?.warehouse,
          errand: {},
        },
      };
    //  END OF DROPPED WAREHOUSE ACTIONS
    case "FETCH_AGENTS_PACK":
      return {
        ...state,
        loading: false,
      };
    case "FETCH_AGENTS_PACK_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        packs: action.payload,
      };
    case "FETCH_AGENTS_PACK_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "FETCH_AGENTS":
      return {
        ...state,
        loading: false,
      };
    case "FETCH_AGENTS_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        agents: action.payload,
      };
    case "FETCH_AGENTS_FAIL":
      return {
        ...state,
        lloading: false,
        error: action.payload,
      };
    case "FETCH_RS_AGENTS":
      return {
        ...state,
        loading: false,
      };
    case "FETCH_RS_AGENTS_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        rs_agents: action.payload,
      };
    case "FETCH_RS_AGENTS_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "FETCH_ZONES":
      return {
        ...state,
        loading: false,
      };
    case "FETCH_ZONES_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        zones: action.payload,
      };
    case "FETCH_ZONES_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "FETCH_ROUTES":
      return {
        ...state,
        loading: false,
      };
    case "FETCH_ROUTES_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        routes: action.payload,
      };
    case "FETCH_ROUTES_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "FETCH_WEBPACKAGES":
      return {
        ...state,
        loading: false,
      };
    case "FETCH_WEBPACKAGES_SUCCESSFUL":
      return {
        ...state,
        loading: false,
        packs: action.payload,
      };
    case "FETCH_WEBPACKAGES_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
