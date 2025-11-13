import {
    TRACE_LIST_SUCCESS_TYPE,
    TRACE_LIST_FAIL_TYPE,
    TRACE_GET_SUCCESS_TYPE,
    TRACE_GET_FAIL_TYPE,
    TRACE_GET_HISTORY_SUCCESS_TYPE,
    TRACE_GET_HISTORY_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const traceReducer = (state, action) => {
    state = state || initialState;

    if (action.type === TRACE_LIST_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRACE_LIST_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRACE_GET_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRACE_GET_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRACE_GET_HISTORY_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRACE_GET_HISTORY_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    return state;
};