import {

    COMPANY_MONTH_REPORT_SUCCESS_TYPE,
    COMPANY_MONTH_REPORT_FAIL_TYPE,

    COMPANY_QUARTER_REPORT_SUCCESS_TYPE,
    COMPANY_QUARTER_REPORT_FAIL_TYPE,

    COMPANY_YEAR_REPORT_SUCCESS_TYPE,
    COMPANY_YEAR_REPORT_FAIL_TYPE
    
} from "../services/Common";

const initialState = { fields: [], provinces: [], districts: [], wards: [] };

export const companyReportsReducer = (state, action) => {
    state = state || initialState;

    if (action.type === COMPANY_MONTH_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === COMPANY_MONTH_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === COMPANY_QUARTER_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === COMPANY_QUARTER_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === COMPANY_YEAR_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === COMPANY_YEAR_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    return state;
};