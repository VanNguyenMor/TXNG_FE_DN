import {

    SALE_STAMP_MONTH_REPORT_SUCCESS_TYPE,
    SALE_STAMP_MONTH_REPORT_FAIL_TYPE,

    SALE_STAMP_QUARTER_REPORT_SUCCESS_TYPE,
    SALE_STAMP_QUARTER_REPORT_FAIL_TYPE,

    SALE_STAMP_YEAR_REPORT_SUCCESS_TYPE,
    SALE_STAMP_YEAR_REPORT_FAIL_TYPE
    
} from "../services/Common";

const initialState = { fields: [], provinces: [], districts: [], wards: [] };

export const SaleStampReportsReducer = (state, action) => {
    state = state || initialState;

    if (action.type === SALE_STAMP_MONTH_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_STAMP_MONTH_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_STAMP_QUARTER_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_STAMP_QUARTER_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_STAMP_YEAR_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === SALE_STAMP_YEAR_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    return state;
};