const initialState = {
    riders: [],
    errors: [],
    error: "",
   
    loading: false,
};

export default function store(state = initialState, action) {
    switch (action.type) {
        case "FETCH_RIDERS":
            return {
                ...state,
                loading: true,
            };
        case "FETCH_RIDERS_SUCCESSFUL":
            return {
                ...state,
                loading: false,
                riders: action.payload,
            };
        case "FETCH_RIDERS_FAIL":
            return {
                ...state,
                loading: true,
                error: action.payload,
            };
        case "ADD_RIDER":
            return {
                ...state,
                loading: true,
            };
        case "ADD_RIDER_SUCCESSFUL":
            return {
                ...state,
                loading: false,
            };
        case "ADD_RIDER_FAIL":
            return {
                ...state,
                loading: true,
                error: action.payload,
            };

        default:
            return state;
    }
}
