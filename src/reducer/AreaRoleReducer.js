import {
    AREA_ROLE_FETCH_LIST_ROLE_SUCCESS,
    AREA_ROLE_FETCH_LIST_ZONE_SUCCESS
} from "../services/Common";

const initialState = { roles: [], areas: [] };

export const areaRoleReducer = (state, action) => {
    state = state || initialState;

    if (action.type === AREA_ROLE_FETCH_LIST_ROLE_SUCCESS) {
        return {
            ...state,
            roles: action.data
        };
    }

    if (action.type === AREA_ROLE_FETCH_LIST_ZONE_SUCCESS) {
        return {
            ...state,
            areas: action.data
        };
    }

    return state;
};