import {
    AREA_GET_FAIL_TYPE,
    AREA_GET_SUCCESS_TYPE,
    AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_SUCCESS_TYPE,
    AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_FAIL_TYPE,
    AREA_GET_LIST_COMPANY_PLANNING_AREA_SUCCESS_TYPE,
    AREA_GET_LIST_COMPANY_PLANNING_AREA_FAIL_TYPE

} from "../services/Common";

const initialState = { fields: [], provinces: [], districts: [], wards: [] };

export const companyAreaReportsReducer = (state, action) => {
    state = state || initialState;

    if (action.type === AREA_GET_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === AREA_GET_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === AREA_GET_LIST_COMPANY_OUTER_PLANNING_AREA_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === AREA_GET_LIST_COMPANY_PLANNING_AREA_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === AREA_GET_LIST_COMPANY_PLANNING_AREA_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    return state;
};