import {
    TYPE_ZONE_PROPERTY_ADD_SUCCESS,
    TYPE_ZONE_PROPERTY_DELETE_SUCCESS,
    TYPE_ZONE_PROPERTY_EDIT_SUCCESS,
    TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_FAILURE,
    TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_SUCCESS
} from "../services/Common";

const initialState = { typeZoneProperties: [] };

export const typeZonePropertyReducer = (state, action) => {
    state = state || initialState;

    if (action.type === TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_SUCCESS) {
        return {
            ...state,
            typeZoneProperties: action.data
        };
    }

    return state;
};