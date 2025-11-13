import {
    REPORTSP_LIST_COLUMN_FAIL_TYPE,
    REPORTSP_LIST_COLUMN_SUCCESS_TYPE,

    REPORTSP_REPORT_FAIL_TYPE,
    REPORTSP_REPORT_SUCCESS_TYPE,

    REPORTSP_LIST_TABLE_SUCCESS_TYPE,
    REPORTSP_LIST_TABLE_FAIL_TYPE,

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const reportSPReducer = (state, action) => {
    state = state || initialState;

    if (action.type == REPORTSP_LIST_COLUMN_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === REPORTSP_LIST_COLUMN_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === REPORTSP_REPORT_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === REPORTSP_REPORT_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === REPORTSP_LIST_TABLE_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === REPORTSP_LIST_TABLE_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }
    return state;
};