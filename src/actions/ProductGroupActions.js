import {
    PRODUCT_GROUP_LIST,
    PRODUCT_GROUP_CREATE,
    PRODUCT_GROUP_DELETE,
    PRODUCT_GROUP_UPDATE,
    PRODUCT_GROUP_GET,
    PRODUCT_GROUP_LOCK
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    PRODUCT_GROUP_LIST_TYPE,
    PRODUCT_GROUP_LIST_SUCCESS_TYPE,
    PRODUCT_GROUP_LIST_FAIL_TYPE,
    PRODUCT_GROUP_CREATE_TYPE,
    PRODUCT_GROUP_CREATE_SUCCESS_TYPE,
    PRODUCT_GROUP_CREATE_FAIL_TYPE,
    PRODUCT_GROUP_GET_TYPE,
    PRODUCT_GROUP_GET_SUCCESS_TYPE,
    PRODUCT_GROUP_GET_FAIL_TYPE,
    PRODUCT_GROUP_UPDATE_TYPE,
    PRODUCT_GROUP_UPDATE_SUCCESS_TYPE,
    PRODUCT_GROUP_UPDATE_FAIL_TYPE,
    PRODUCT_GROUP_DELETE_TYPE,
    PRODUCT_GROUP_DELETE_SUCCESS_TYPE,
    PRODUCT_GROUP_DELETE_FAIL_TYPE,
    PRODUCT_GROUP_LOCK_SUCCESS_TYPE,
    PRODUCT_GROUP_LOCK_FAIL_TYPE,
    PRODUCT_GROUP_LOCK_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionProductGroup = {
    requestListProductGroup: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCT_GROUP_LIST_TYPE, data: initialState
            });

            await post(PRODUCT_GROUP_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCT_GROUP_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCT_GROUP_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_GROUP_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetProductGroup: (id) => async (dispatch, getState) => {
        dispatch({
            type: PRODUCT_GROUP_GET_TYPE, data: initialState
        });

        return await get(PRODUCT_GROUP_GET + id)
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
    requestCreateProductGroup: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCT_GROUP_CREATE_TYPE, data: initialState
            });

            await post(PRODUCT_GROUP_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: PRODUCT_GROUP_CREATE_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: PRODUCT_GROUP_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_GROUP_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    requestLockProductGroup: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCT_GROUP_LOCK_TYPE, data: initialState
            });

            return await get(PRODUCT_GROUP_LOCK + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCT_GROUP_LOCK_SUCCESS_TYPE, data: { lock: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCT_GROUP_LOCK_FAIL_TYPE, data: { lock: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_GROUP_LOCK_FAIL_TYPE, data: { lock: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    requestUpdateProductGroup: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCT_GROUP_UPDATE_TYPE, data: initialState
            });

            await post(PRODUCT_GROUP_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: PRODUCT_GROUP_UPDATE_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: PRODUCT_GROUP_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_GROUP_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteProductGroup: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCT_GROUP_DELETE_TYPE, data: initialState
            });

            return await del(PRODUCT_GROUP_DELETE + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCT_GROUP_DELETE_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCT_GROUP_DELETE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_GROUP_DELETE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },
}