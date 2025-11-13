import {
    PRODUCT_REPORT_GET_SUCCESS_TYPE,
    PRODUCT_REPORT_GET_FAIL_TYPE,

    PRODUCT_REPORT_GET_BY_GROUP_SUCCESS_TYPE,
    PRODUCT_REPORT_GET_BY_GROUP_FAIL_TYPE

} from "../services/Common";

const initialState = { fields: [], provinces: [], districts: [], wards: [] };

export const productReportsReducer = (state, action) => {
    state = state || initialState;

    if (action.type === PRODUCT_REPORT_GET_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === PRODUCT_REPORT_GET_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === PRODUCT_REPORT_GET_BY_GROUP_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === PRODUCT_REPORT_GET_BY_GROUP_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }
    return state;
};