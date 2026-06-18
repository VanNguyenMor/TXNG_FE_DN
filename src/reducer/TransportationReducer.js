import {
    TRANSPORTATION_LIST_SUCCESS_TYPE,
    TRANSPORTATION_LIST_FAIL_TYPE,
    TRANSPORTATION_GET_SUCCESS_TYPE,
    TRANSPORTATION_GET_FAIL_TYPE,
    TRANSPORTATION_CREATE_SUCCESS_TYPE,
    TRANSPORTATION_CREATE_FAIL_TYPE,
    TRANSPORTATION_UPDATE_SUCCESS_TYPE,
    TRANSPORTATION_UPDATE_FAIL_TYPE,
    TRANSPORTATION_DELETE_SUCCESS_TYPE,
    TRANSPORTATION_DELETE_FAIL_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const transportationReducer = (state, action) => {
    state = state || initialState;

    if (action.type === TRANSPORTATION_LIST_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_LIST_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_GET_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_GET_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_CREATE_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_CREATE_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_UPDATE_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_UPDATE_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_DELETE_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === TRANSPORTATION_DELETE_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    return state;
};
