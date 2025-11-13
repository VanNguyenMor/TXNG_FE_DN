import {
    MATERIAL_GROUP_LIST,
    MATERIAL_GROUP_LOG_LIST,
    MATERIAL_GROUP_CREATE,
    MATERIAL_GROUP_DELETE,
    MATERIAL_GROUP_UPDATE,
    MATERIAL_GROUP_GET,
    MATERIAL_GROUP_LOCK,
    MATERIAL_GROUP_LOG_PRODUCT_LIST
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    MATERIAL_GROUP_LIST_TYPE,
    MATERIAL_GROUP_LIST_SUCCESS_TYPE,
    MATERIAL_GROUP_LIST_FAIL_TYPE,
    MATERIAL_GROUP_LOG_LIST_TYPE,
    MATERIAL_GROUP_LOG_LIST_SUCCESS_TYPE,
    MATERIAL_GROUP_LOG_LIST_FAIL_TYPE,
    MATERIAL_GROUP_CREATE_TYPE,
    MATERIAL_GROUP_CREATE_SUCCESS_TYPE,
    MATERIAL_GROUP_CREATE_FAIL_TYPE,
    MATERIAL_GROUP_GET_TYPE,
    MATERIAL_GROUP_GET_SUCCESS_TYPE,
    MATERIAL_GROUP_GET_FAIL_TYPE,
    MATERIAL_GROUP_UPDATE_TYPE,
    MATERIAL_GROUP_UPDATE_SUCCESS_TYPE,
    MATERIAL_GROUP_UPDATE_FAIL_TYPE,
    MATERIAL_GROUP_DELETE_TYPE,
    MATERIAL_GROUP_DELETE_SUCCESS_TYPE,
    MATERIAL_GROUP_DELETE_FAIL_TYPE,
    MATERIAL_GROUP_LOCK_TYPE,
    MATERIAL_GROUP_LOCK_FAIL_TYPE,
    MATERIAL_GROUP_LOCK_SUCCESS_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionMaterialGroup = {
    requestListMaterialGroup: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: MATERIAL_GROUP_LIST_TYPE, data: initialState
            });

            await post(MATERIAL_GROUP_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: MATERIAL_GROUP_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: MATERIAL_GROUP_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: MATERIAL_GROUP_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    requestListLogMaterialGroup: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: MATERIAL_GROUP_LOG_LIST_TYPE, data: initialState
            });

            await post(MATERIAL_GROUP_LOG_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: MATERIAL_GROUP_LOG_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: MATERIAL_GROUP_LOG_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: MATERIAL_GROUP_LOG_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestListLogMaterialGroupProduct: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: MATERIAL_GROUP_LOG_LIST_TYPE, data: initialState
            });

            await post(MATERIAL_GROUP_LOG_PRODUCT_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: MATERIAL_GROUP_LOG_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: MATERIAL_GROUP_LOG_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: MATERIAL_GROUP_LOG_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetMaterialGroup: (id) => async (dispatch, getState) => {
        dispatch({
            type: MATERIAL_GROUP_GET_TYPE, data: initialState
        });

        return await get(MATERIAL_GROUP_GET + id)
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
    requestCreateMaterialGroup: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: MATERIAL_GROUP_CREATE_TYPE, data: initialState
            });

            await post(MATERIAL_GROUP_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: MATERIAL_GROUP_CREATE_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: MATERIAL_GROUP_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: MATERIAL_GROUP_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestUpdateMaterialGroup: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: MATERIAL_GROUP_UPDATE_TYPE, data: initialState
            });

            await post(MATERIAL_GROUP_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: MATERIAL_GROUP_UPDATE_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: MATERIAL_GROUP_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: MATERIAL_GROUP_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteMaterialGroup: (id) => async (dispatch, getState) => {
        dispatch({
            type: MATERIAL_GROUP_DELETE_TYPE, data: initialState
        });

        return await del(MATERIAL_GROUP_DELETE + id)
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
    requestLockMaterialGroup: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: MATERIAL_GROUP_LOCK_TYPE, data: initialState
            });

            return await get(MATERIAL_GROUP_LOCK + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: MATERIAL_GROUP_LOCK_SUCCESS_TYPE, data: { lock: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: MATERIAL_GROUP_LOCK_FAIL_TYPE, data: { lock: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: MATERIAL_GROUP_LOCK_FAIL_TYPE, data: { lock: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
}