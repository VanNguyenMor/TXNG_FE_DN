import {
    FETCH_LIST_FIELD_SUCCESS,
    FETCH_LIST_FIELD_FAILURE,
    FETCH_LIST_DISTRICT_BY_PROVINCE_FALIURE,
    FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
    FETCH_LIST_PROVINCE_FAILURE,
    FETCH_LIST_PROVINCE_SUCCESS,
    FETCH_LIST_WARD_BY_DISTRICT_FAILURE,
    FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,

    
    

} from "../services/Common";

const initialState = { fields: [], provinces: [], districts: [], wards: [] };

export const companyReducer = (state, action) => {
    state = state || initialState;

    if (action.type === FETCH_LIST_FIELD_SUCCESS) {
        return {
            ...state,
            fields: action.data
        };
    }

    if (action.type === FETCH_LIST_PROVINCE_SUCCESS) {
        return {
            ...state,
            provinces: action.data
        };
    }

    if (action.type === FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS) {
        return {
            ...state,
            districts: action.data
        };
    }

    if (action.type === FETCH_LIST_WARD_BY_DISTRICT_SUCCESS) {
        return {
            ...state,
            wards: action.data
        };
    }

    return state;
};