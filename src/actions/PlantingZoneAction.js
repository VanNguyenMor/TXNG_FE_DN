import {
    PLANTING_ZONE_GET_LIST,
    PLANTING_ZONE_GET_LIST_PLANTING_TYPE,
    PLANTING_ZONE_CREATE,
    PLANTING_ZONE_UPDATE,
    PLANTING_ZONE_DELETE,
    PLANTING_ZONE_DETAIL,
    GOOD_DELIVERY_GET_LIST
} from "../apis";
import {
    post, del, get, postFormData
} from "../services/Dataservice";
import {
    PLANTING_ZONE_FETCH_LIST_SUCCESS,
    PLANTING_ZONE_FETCH_LIST_FAILURE,
    PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_FAILURE,
    PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_SUCCESS,
    PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_SUCCESS,
    PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_FAILURE
} from "../services/Common";

export const platingZoneAction = {
    getListPlantingZone: data => async (dispatch, _) => {
        dispatch({
            type: PLANTING_ZONE_FETCH_LIST_SUCCESS,
            data: []
        });

        return new Promise(resolve => {
            post(PLANTING_ZONE_GET_LIST, data).then(res => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_SUCCESS,
                    data: res.data.plantingZones || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getListGoodDeliveryNote: data => async (dispatch, _) => {
        dispatch({
            type: PLANTING_ZONE_FETCH_LIST_SUCCESS,
            data: []
        });

        return new Promise(resolve => {
            post(GOOD_DELIVERY_GET_LIST, data).then(res => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_SUCCESS,
                    data: res.data.goodsDeliveryNotes || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getListPlantingType: data => async (dispatch, _) => {
        dispatch({
            type: PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_SUCCESS,
            data: []
        });

        return new Promise(resolve => {
            post(PLANTING_ZONE_GET_LIST_PLANTING_TYPE, data).then(res => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_SUCCESS,
                    data: res.data.plantingTypes || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_PLANTING_TYPE_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getListPlantingZoneForComboBox: data => async (dispatch, _) => {
        dispatch({
            type: PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_SUCCESS,
            data: []
        });

        return new Promise(resolve => {
            post(PLANTING_ZONE_GET_LIST, data).then(res => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_SUCCESS,
                    data: res.data.plantingZones || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: PLANTING_ZONE_FETCH_LIST_FOR_COMBOBOX_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    addPlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            postFormData(PLANTING_ZONE_CREATE, data).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    editPlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            postFormData(PLANTING_ZONE_UPDATE, data).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    deletePlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = PLANTING_ZONE_DELETE.replace('{0}', data.id);

            del(url, data).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getDetailPlantingZone: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = PLANTING_ZONE_DETAIL.replace('{0}', data.id);

            get(url, data).then(res => {
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
}