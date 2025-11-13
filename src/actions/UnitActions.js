import {
    UNIT_LIST,
    UNIT_CREATE,
    UNIT_DELETE,
    UNIT_UPDATE,
    UNIT_GET,
    UNIT_LOCK
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    UNIT_LIST_TYPE,
    UNIT_LIST_SUCCESS_TYPE,
    UNIT_LIST_FAIL_TYPE,
    UNIT_CREATE_TYPE,
    UNIT_CREATE_SUCCESS_TYPE,
    UNIT_CREATE_FAIL_TYPE,
    UNIT_GET_TYPE,
    UNIT_GET_SUCCESS_TYPE,
    UNIT_GET_FAIL_TYPE,
    UNIT_UPDATE_TYPE,
    UNIT_UPDATE_SUCCESS_TYPE,
    UNIT_UPDATE_FAIL_TYPE,
    UNIT_DELETE_TYPE,
    UNIT_DELETE_SUCCESS_TYPE,
    UNIT_DELETE_FAIL_TYPE,

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionUnit = {
    requestListUnit: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: UNIT_LIST_TYPE, data: initialState
            });
            
            await post(UNIT_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: UNIT_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: UNIT_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: UNIT_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetUnit: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: UNIT_GET_TYPE, data: initialState
            });

            return await get(UNIT_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: UNIT_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: UNIT_DELETE_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: UNIT_DELETE_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        })
    },
    requestCreateUnit: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: UNIT_CREATE_TYPE, data: initialState
            });

            await post(UNIT_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: UNIT_CREATE_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: UNIT_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: UNIT_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },



    requestUpdateUnit: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: UNIT_UPDATE_TYPE, data: initialState
            });

            await post(UNIT_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: UNIT_UPDATE_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: UNIT_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: UNIT_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteUnit: (id) => async (dispatch, getState) => {
        dispatch({
            type: UNIT_DELETE_TYPE, data: initialState
        });

        return await del(UNIT_DELETE + id)
        // .then(res => {
        //     if (res.status === SUCCESS_CODE) {
        //         dispatch({ type: GET_COMPANY_LOCK_SUCCESS_TYPE, data: { company: res.data, isLoading: true, status: true, message: res.message } });
        //     } else {
        //         dispatch({ type: GET_COMPANY_LOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: res.message } });
        //     }
        // })
        // .catch(err => {
        //     dispatch({ type: GET_COMPANY_LOCK_FAIL_TYPE, data: { company: [], isLoading: true, status: false, message: err.message } });
        // })
    },
}