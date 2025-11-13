import {

    SALE_REGISTER_MONTH_REPORT_SUCCESS_TYPE,
    SALE_REGISTER_MONTH_REPORT_FAIL_TYPE,

    SALE_REGISTER_QUARTER_REPORT_SUCCESS_TYPE,
    SALE_REGISTER_QUARTER_REPORT_FAIL_TYPE,

    SALE_REGISTER_YEAR_REPORT_SUCCESS_TYPE,
    SALE_REGISTER_YEAR_REPORT_FAIL_TYPE
    
} from "../services/Common";

const initialState = { fields: [], provinces: [], districts: [], wards: [] };

export const SaleRegisterReportsReducer = (state, action) => {
    state = state || initialState;

    if (action.type === SALE_REGISTER_MONTH_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_REGISTER_MONTH_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_REGISTER_QUARTER_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_REGISTER_QUARTER_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_REGISTER_YEAR_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_REGISTER_YEAR_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    return state;
};