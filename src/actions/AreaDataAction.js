import {
    AREA_CODE_PROVINCE,
    AREA_CODE_DISTRICT_BY_PROVINCE,
    AREA_CODE_WARD_BY_DISTRICT,
    AREA_CODE_ADD,
    AREA_CODE_DELETE,
    AREA_CODE_EDIT,
    AREA_CODE_DETAIL
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_FAILURE,
    AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
    AREA_CODE_FETCH_LIST_PROVINCE_FAILURE,
    AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,
    AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_FAILURE,
    AREA_CODE_FETCH_LIST_PROVINCE_SUCCESS,
    AREA_CODE_DELETE_SUCCESS,
    AREA_CODE_ADD_SUCCESS,
    AREA_CODE_EDIT_SUCCESS
} from "../services/Common";

export const areaDataAction = {
    getListProvince: data => async (dispatch, _) => {
        dispatch({
            type: AREA_CODE_FETCH_LIST_PROVINCE_SUCCESS,
            data: []
        });

       return new Promise(resolve => {
            get(AREA_CODE_PROVINCE, data).then(res => {
                dispatch({
                    type: AREA_CODE_FETCH_LIST_PROVINCE_SUCCESS,
                    data: res.data ? [res.data] : []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: AREA_CODE_FETCH_LIST_PROVINCE_FAILURE, 
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
       });
    },
    getListDistrictByProvince: data => async (dispatch, _) => {
        dispatch({
            type: AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
            data: []
        });

        return new Promise(resolve => {
            get(AREA_CODE_DISTRICT_BY_PROVINCE, data).then(res => {
                dispatch({
                    type: AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
                    data: res.data || []
                });
    
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: AREA_CODE_FETCH_LIST_DISTRICT_BY_PROVINCE_FAILURE, 
                    data: []
                });
    
                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getListWardByDistrict: data => async (dispatch, _) => {
        dispatch({
            type: AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,
            data: []
        });

        const url = AREA_CODE_WARD_BY_DISTRICT.replace('{0}', data.id);

        return new Promise(resolve => {
            get(url, data).then(res => {
                dispatch({
                    type: AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,
                    data: res.data || []
                });
    
                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: AREA_CODE_FETCH_LIST_WARD_BY_DISTRICT_FAILURE, 
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
            post(AREA_CODE_ADD, data).then(res => {
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
            post(AREA_CODE_EDIT, data).then(res => {
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
            const url = AREA_CODE_DELETE.replace('{0}', data.id);

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
            const url = AREA_CODE_DETAIL.replace('{0}', data.id);

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