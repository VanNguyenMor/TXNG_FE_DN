import {
    FETCH_LIST_MENU_SUCCESS,
    FETCH_LIST_MENU_FAILURE
} from "../services/Common";

const initialState = { menus: [] };

export const configReducer = (state, action) => {
    state = state || initialState;

    if (action.type === FETCH_LIST_MENU_SUCCESS) {
        return {
            menus: action.data
        };
    }

    if (action.type === FETCH_LIST_MENU_FAILURE) {
        return {
            menus: action.data
        };
    }

    return state;
};