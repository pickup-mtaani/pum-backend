const initialState = {
    zones: [],
    errors: [],
    error: "",
    agents: [],
    routes: [],
    packs: [],
    loading: false,
};

export default function store(state = initialState, action) {
    switch (action.type) {
        case "FETCH_AGENTS_PACK":
            return {
                ...state,
                loading: true,
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
                loading: true,
                error: action.payload,
            };
        case "FETCH_AGENTS":
            return {
                ...state,
                loading: true,
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
                loading: true,
                error: action.payload,
            };
        case "FETCH_ZONES":
            return {
                ...state,
                loading: true,
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
                loading: true,
                error: action.payload,
            };

        case "FETCH_ROUTES":
            return {
                ...state,
                loading: true,
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
                loading: true,
                error: action.payload,
            };
        case "FETCH_WEBPACKAGES":
            return {
                ...state,
                loading: true,
            };
        case "FETCH_WEBPACKAGES_SUCCESSFUL":
            return {
                ...state,
                loading: false,
                packs: action.payload
            };
        case "FETCH_WEBPACKAGES_FAIL":
            return {
                ...state,
                loading: true,
                error: action.payload,
            };

        default:
            return state;
    }
}
