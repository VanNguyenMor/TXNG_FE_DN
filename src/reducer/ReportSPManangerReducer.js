import {
    REPORTSP_MANGER_LIST_SUCCESS_TYPE,
    REPORTSP_MANGER_LIST_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const reportSPManangerReducer = (state, action) => {
    state = state || initialState;

    if (action.type == REPORTSP_MANGER_LIST_SUCCESS_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    if (action.type === REPORTSP_MANGER_LIST_FAIL_TYPE) {
        return {
            data: action.data,
            isLoading: action.isLoading,
            status: action.status,
            message: action.message,
        };
    }

    
    return state;
};