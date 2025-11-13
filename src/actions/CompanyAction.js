import {
    LOCATION_PROVINCE,
    LOCATION_DISTRICT_BY_PROVINCE,
    LOCATION_WARD_BY_DISTRICT,
    FIELD_GET_ALL,
    COMPANY_ADD,
    COMPANY_UPDATE,
    COMPANY_DETAIL,
    
} from "../apis";
import {
    get,
    post,
    postFormData
} from "../services/Dataservice";
import {
    FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,
    FETCH_LIST_WARD_BY_DISTRICT_FAILURE,
    FETCH_LIST_PROVINCE_SUCCESS,
    FETCH_LIST_PROVINCE_FAILURE,
    FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
    FETCH_LIST_DISTRICT_BY_PROVINCE_FAILURE,
    FETCH_LIST_FIELD_FAILURE,
    FETCH_LIST_FIELD_SUCCESS,
    

} from "../services/Common";

export const companyAction = {
    getListField: data => async (dispatch, _) => {
        return new Promise(resolve => {
            dispatch({
                type: FETCH_LIST_FIELD_SUCCESS,
                data: []
            });

            post(FIELD_GET_ALL, data).then(res => {
                dispatch({
                    type: FETCH_LIST_FIELD_SUCCESS,
                    data: res.data.fields || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: FETCH_LIST_FIELD_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    getListProvince: data => async (dispatch, _) => {
        return new Promise(resolve => {
            dispatch({
                type: FETCH_LIST_PROVINCE_SUCCESS,
                data: []
            });

            get(LOCATION_PROVINCE, data).then(res => {
                dispatch({
                    type: FETCH_LIST_PROVINCE_SUCCESS,
                    data: res.data ? [res.data] : []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: FETCH_LIST_PROVINCE_FAILURE,
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
        return new Promise(resolve => {
            dispatch({
                type: FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
                data: []
            });

            get(LOCATION_DISTRICT_BY_PROVINCE, data).then(res => {
                dispatch({
                    type: FETCH_LIST_DISTRICT_BY_PROVINCE_SUCCESS,
                    data: res.data || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: FETCH_LIST_DISTRICT_BY_PROVINCE_FAILURE,
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
        return new Promise(resolve => {
            dispatch({
                type: FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,
                data: []
            });

            const url = LOCATION_WARD_BY_DISTRICT.replace('{0}', data.id);

            get(url, data).then(res => {
                dispatch({
                    type: FETCH_LIST_WARD_BY_DISTRICT_SUCCESS,
                    data: res.data || []
                });

                resolve({
                    ok: true,
                    data: res
                });
            }).catch(err => {
                dispatch({
                    type: FETCH_LIST_WARD_BY_DISTRICT_FAILURE,
                    data: []
                });

                resolve({
                    ok: false,
                    data: err
                });
            });
        });
    },
    addCompany: data => async (dispatch, _) => {
        return new Promise(resolve => {
            postFormData(COMPANY_ADD, data).then(res => {
                resolve({
                    ok: res.status == 200 ? true : false,
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
    editCompany: data => async (dispatch, _) => {
        return new Promise(resolve => {
            postFormData(COMPANY_UPDATE, data).then(res => {
                resolve({
                    ok: res.status == 200 ? true : false,
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
    getDetailCompany: data => async (dispatch, _) => {
        return new Promise(resolve => {
            const url = COMPANY_DETAIL.replace('{0}', data.id);

            get(url, data).then(res => {
                resolve({
                    ok: res.status == 200 ? true : false,
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