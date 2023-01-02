const initialState = {
    destinations: [],
    errors: [],
    error: "",
    payments: [],
    loading: false,
};

export default function store(state = initialState, action) {
    switch (action.type) {
        case "FETCH_DESTINATIONS":
            return {
                ...state,
                loading: true,
            };
        case "FETCH_DESTINATIONS_SUCCESSFUL":
            return {
                ...state,
                loading: false,
                destinations: action.payload,
            };
        case "FETCH_DESTINATIONS_FAIL":
            return {
                ...state,
                loading: true,
                error: action.payload,
            };
        // case "FETCH_PAYMENTS":
        //     return {
        //         ...state,
        //         loading: true,
        //     };
        // case "FETCH_PAYMENTS_SUCCESSFUL":

        //     return {
        //         ...state,
        //         loading: false,
        //         payments: action.payload,
        //     };
        // case "FETCH_PAYMENTS_FAIL":
        //     return {
        //         ...state,
        //         loading: true,
        //         error: action.payload,
        //     };
        // case "ADD_RIDER":
        //     return {
        //         ...state,
        //         loading: true,
        //     };
        // case "ADD_RIDER_SUCCESSFUL":
        //     return {
        //         ...state,
        //         loading: false,
        //     };
        // case "ADD_RIDER_FAIL":
        //     return {
        //         ...state,
        //         loading: true,
        //         error: action.payload,
        //     };

        default:
            return state;
    }
}
