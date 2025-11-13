import {
    CONFIG_FETCH_CONFIG_SYSTEM_SUCCESS,
    CONFIG_FETCH_INFO_COMPANY_SUCCESS,
    CONFIG_FETCH_LIST_CONFIG_SERVER_SUCCESS,
    CONFIG_FETCH_LIST_PROVINCE_FOR_INFO_COMPANY_SUCCESS,
    CONFIG_FETCH_LIST_DISTRICT_FOR_INFO_COMPANY_SUCCESS,
    CONFIG_FETCH_LIST_WARD_FOR_INFO_COMPANY_SUCCESS,
    CONFIG_GET_FTP_SUCCESS,
    CONFIG_GET_LIST_ALERT_SUCCESS_TYPE,
    CONFIG_CREATE_ALERT_ROLES_SUCCESS_TYPE,
    CONFIG_DELETE_ALERT_ROLES_SUCCESS_TYPE,
    CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT_SUCCESS_TYPE,
    CONFIG_GET_LIST_ROLES_BY_SELECT_SUCCESS_TYPE,
    CONFIG_GET_LIST_ROLES_BY_SELECT_FAIL_TYPE,
    CONFIG_GET_LIST_STAMP_PRICE_SUCCESS_TYPE,
    CONFIG_GET_LIST_STAMP_PRICE_FAIL_TYPE,
    CONFIG_CREATE_STAMP_PRICE_SUCCESS_TYPE,
    CONFIG_CREATE_STAMP_PRICE_FAIL_TYPE,
    CONFIG_DELETE_STAMP_PRICE_SUCCESS_TYPE,
    CONFIG_DELETE_STAMP_PRICE_FAIL_TYPE

} from "../services/Common";

const initialState = { infoCompany: {}, configSystem: {}, configServers: [], provincesForInfoCompany: [], districtsForInfoCompany: [], wardsForInfoCompany: [] };

export const configSystemReducer = (state, action) => {
    state = state || initialState;

    if (action.type === CONFIG_FETCH_CONFIG_SYSTEM_SUCCESS) {
        return {
            ...state,
            configSystem: action.data
        };
    }

    if (action.type === CONFIG_FETCH_INFO_COMPANY_SUCCESS) {
        return {
            ...state,
            infoCompany: action.data
        };
    }

    if (action.type === CONFIG_FETCH_LIST_CONFIG_SERVER_SUCCESS) {
        return {
            ...state,
            configServers: action.data
        };
    }

    if (action.type === CONFIG_FETCH_LIST_PROVINCE_FOR_INFO_COMPANY_SUCCESS) {
        return {
            ...state,
            provincesForInfoCompany: action.data,
            data: action.data
        };
    }

    if (action.type === CONFIG_FETCH_LIST_DISTRICT_FOR_INFO_COMPANY_SUCCESS) {
        return {
            ...state,
            districtsForInfoCompany: action.data
        };
    }

    if (action.type === CONFIG_FETCH_LIST_WARD_FOR_INFO_COMPANY_SUCCESS) {
        return {
            ...state,
            wardsForInfoCompany: action.data
        };
    }

    if (action.type === CONFIG_GET_FTP_SUCCESS) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    if (action.type === CONFIG_GET_LIST_ALERT_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    if (action.type === CONFIG_CREATE_ALERT_ROLES_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    if (action.type === CONFIG_DELETE_ALERT_ROLES_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    if (action.type === CONFIG_GET_LIST_ALERT_ROLES_BY_SELECT_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    if (action.type === CONFIG_GET_LIST_ROLES_BY_SELECT_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    if (action.type === CONFIG_GET_LIST_ROLES_BY_SELECT_FAIL_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    if (action.type === CONFIG_GET_LIST_STAMP_PRICE_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }
    if (action.type === CONFIG_GET_LIST_STAMP_PRICE_FAIL_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }
    if (action.type === CONFIG_CREATE_STAMP_PRICE_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }
    if (action.type === CONFIG_CREATE_STAMP_PRICE_FAIL_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }
    if (action.type === CONFIG_DELETE_STAMP_PRICE_SUCCESS_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }
    if (action.type === CONFIG_DELETE_STAMP_PRICE_FAIL_TYPE) {
        return {
            ...state,
            getFtp: action.data
        };
    }

    return state;
};