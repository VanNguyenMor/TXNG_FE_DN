import {
    PLANTING_ZONE_FETCH_LIST_SUCCESS,
    PLANTING_ZONE_FETCH_LIST_FAILURE,
    PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_SUCCESS,
    PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_FAILURE,
    PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_SUCCESS,
    PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_FAILURE
} from "../services/Common";

const initialState = { plantingZones: [], platingTypes: [], plantingZoneForComboBoxs: [] };

export const plantingZoneReducer = (state, action) => {
    state = state || initialState;

    if (action.type === PLANTING_ZONE_FETCH_LIST_SUCCESS) {
        return {
            ...state,
            plantingZones: action.data
        };
    }

    if (action.type === PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_SUCCESS) {
        return {
            ...state,
            platingTypes: action.data
        };
    }

    if (action.type === PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_SUCCESS) {
        return {
            ...state,
            plantingZoneForComboBoxs: action.data
        };
    }

    return state;
};