import {
    UNIT_LIST_SUCCESS_TYPE,
    UNIT_LIST_FAIL_TYPE,
    UNIT_GET_SUCCESS_TYPE,
    UNIT_GET_FAIL_TYPE,
    UNIT_CREATE_SUCCESS_TYPE,
    UNIT_CREATE_FAIL_TYPE,
    UNIT_UPDATE_SUCCESS_TYPE,
    UNIT_UPDATE_FAIL_TYPE,
    UNIT_DELETE_SUCCESS_TYPE,
    UNIT_DELETE_FAIL_TYPE,
    
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const unitReducer = (state, action) => {
    state = state || initialState;

    if (action.type === UNIT_LIST_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_LIST_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_GET_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_GET_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_GET_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_GET_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_CREATE_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_CREATE_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_UPDATE_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_UPDATE_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_DELETE_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === UNIT_DELETE_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    
    return state;
};