import {
    AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_FAILURE,
    AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
    AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_FAILURE,
    AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,
    AREA_CODE_FETCH_LIST_PROVINCE_SUCCESS,
    AREA_CODE_FETCH_LIST_PROVINCE_FAILURE
} from "../services/Common";

const initialState = { provinces: [], districts: [], wards: [] };

export const areaDataReducer = (state, action) => {
    state = state || initialState;

    if (action.type === AREA_CODE_FETCH_LIST_PROVINCE_SUCCESS) {
        return {
            ...state,
            provinces: action.data
        };
    }

    if (action.type === AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS) {
        return {
            ...state,
            districts: action.data
        };
    }

    if (action.type === AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_SUCCESS) {
        return {
            ...state,
            wards: action.data
        };
    }

    return state;
};