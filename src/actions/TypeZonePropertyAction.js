import {
    TYPE_ZONE_PROPERTY_LIST,
    TYPE_ZONE_PROPERTY_DELETE,
    TYPE_ZONE_PROPERTY_DETAIL,
    TYPE_ZONE_PROPERTY_ADD,
    TYPE_ZONE_PROPERTY_EDIT
} from "../apis";
import {
    del,
    get,
    post
} from "../services/Dataservice";
import {
    TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_SUCCESS,
    TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_FAILURE
} from "../services/Common";

export const typeZonePropertyAction = {
    getListTypeZoneProperty: data => async (dispatch, _) => {
        return new Promise(resolve => {
            dispatch({
                type: TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_SUCCESS,
                data: []
            });

            post(TYPE_ZONE_PROPERTY_LIST, data).then(res => {
                dispatch({
                    type: TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_SUCCESS,
                    data: res || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: TYPE_ZONE_PROPERTY_FETCH_LIST_ZONE_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    deleteTypeZoneProperty: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = TYPE_ZONE_PROPERTY_DELETE.replace('{0}', data.id);

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
    getDetailTypeZoneProperty: data => async (_, __) => {
        return new Promise(resolve => {
            const url = TYPE_ZONE_PROPERTY_DETAIL.replace('{0}', data.id);

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
    addTypeZoneProperty: data => async (_, __) => {
        return new Promise(resolve => {
            post(TYPE_ZONE_PROPERTY_ADD, data).then(res => {
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
    editTypeZoneProperty: data => async (_, __) => {
        return new Promise(resolve => {
            post(TYPE_ZONE_PROPERTY_EDIT, data).then(res => {
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