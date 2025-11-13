import {
    AREA_ROLE_ROLE,
    AREA_ROLE_ROLE_ALL,
    AREA_ROLE_ROLE_ALL_EXCLUDE,
    AREA_ROLE_AREA,
    AREA_ROLE_ADD,
    AREA_ROLE_EDIT,
    AREA_ROLE_DELETE,
    AREA_ROLE_DETAIL
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    AREA_ROLE_FETCH_LIST_ZONE_SUCCESS,
    AREA_ROLE_FETCH_LIST_ROLE_SUCCESS,
    AREA_ROLE_FETCH_LIST_ZONE_FAILURE,
    AREA_ROLE_FETCH_LIST_ROLE_FAILURE,
    SUCCESS_CODE
} from "../services/Common";

export const areaRoleAction = {
    getListRole: data => async (dispatch, _) => {
        dispatch({
            type: AREA_ROLE_FETCH_LIST_ROLE_SUCCESS,
            data: []
        });

        return new Promise(async resolve => {
            await post(AREA_ROLE_ROLE_ALL_EXCLUDE, data).then(res => {
                // console.log();
                // if (res.status === SUCCESS_CODE) {
                dispatch({
                    type: AREA_ROLE_FETCH_LIST_ROLE_SUCCESS,
                    data: (res.data || {}).roles || []
                });
                // } else {
                resolve({
                    ok: true,
                    data: res
                });
                // }
            }).catch(err => {
                dispatch({
                    type: AREA_ROLE_FETCH_LIST_ROLE_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    // getListAllRole: data => async (dispatch, _) => {
    //     dispatch({
    //         type: AREA_ROLE_FETCH_LIST_ROLE_SUCCESS,
    //         data: []
    //     });

    //     return new Promise(resolve => {
    //         post(AREA_ROLE_ROLE_ALL, data).then(res => {
    //             console.log(res, 11111);
    //             if (res.status === SUCCESS_CODE) {
    //                 dispatch({
    //                     type: AREA_ROLE_FETCH_LIST_ROLE_SUCCESS,
    //                     data: (res.data || {}).roles || []
    //                 });
    //             } else {
    //                 resolve({
    //                     ok: true,
    //                     data: res
    //                 });
    //             }
    //         }).catch(err => {
    //             dispatch({
    //                 type: AREA_ROLE_FETCH_LIST_ROLE_FAILURE,
    //                 data: []
    //             });

    //             resolve({
    //                 ok: false,
    //                 data: err
    //             });
    //         });
    //     });
    // },
    getListZone: data => async (dispatch, _) => {
        dispatch({
            type: AREA_ROLE_FETCH_LIST_ZONE_SUCCESS,
            data: []
        });

        return new Promise(resolve => {
            post(AREA_ROLE_AREA, data).then(res => {
                dispatch({
                    type: AREA_ROLE_FETCH_LIST_ZONE_SUCCESS,
                    data: res.data.zones || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: AREA_ROLE_FETCH_LIST_ZONE_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    addArea: data => async (dispatch, _) => {
        return new Promise(resolve => {
            post(AREA_ROLE_ADD, data).then(res => {
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
    editArea: data => async (dispatch, _) => {
        return new Promise(resolve => {
            post(AREA_ROLE_EDIT, data).then(res => {
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
    deleteArea: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = AREA_ROLE_DELETE.replace('{0}', data.id);

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
    getDetailArea: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = AREA_ROLE_DETAIL.replace('{0}', data.id);

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
    }
}