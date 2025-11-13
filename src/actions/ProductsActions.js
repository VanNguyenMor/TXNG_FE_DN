import {
    PRODUCTS_LIST,
    PRODUCTS_LIST_IN_ALERT,
    PRODUCTS_LIST_VERIFY,
    PRODUCTS_GET,
    PRODUCTS_LIST_LOCK,
    PRODUCTS_CONFIRM,
    PRODUCTS_UNCONFIRM,
    PRODUCTS_VERIFY,
    PRODUCTS_UPLOAD_VERIFY,
    PRODUCTS_DELETE_UPLOAD_VERIFY
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    PRODUCTS_LIST_TYPE,
    PRODUCTS_LIST_SUCCESS_TYPE,
    PRODUCTS_LIST_FAIL_TYPE,
    PRODUCTS_LIST_IN_ALERT_TYPE,
    PRODUCTS_LIST_IN_ALERT_SUCCESS_TYPE,
    PRODUCTS_LIST_IN_ALERT_FAIL_TYPE,
    PRODUCTS_LIST_VERIFY_TYPE,
    PRODUCTS_LIST_VERIFY_SUCCESS_TYPE,
    PRODUCTS_LIST_VERIFY_FAIL_TYPE,
    PRODUCTS_VERIFY_IMAGE_TYPE,
    PRODUCTS_VERIFY_IMAGE_SUCCESS_TYPE,
    PRODUCTS_VERIFY_IMAGE_FAIL_TYPE,
    PRODUCTS_UPLOAD_VERIFY_TYPE,
    PRODUCTS_UPLOAD_VERIFY_SUCCESS_TYPE,
    PRODUCTS_UPLOAD_VERIFY_FAIL_TYPE,
    PRODUCTS_DELETE_UPLOAD_VERIFY_TYPE,
    PRODUCTS_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE,
    PRODUCTS_DELETE_UPLOAD_VERIFY_FAIL_TYPE,
    PRODUCTS_GET_TYPE,
    PRODUCTS_GET_SUCCESS_TYPE,
    PRODUCTS_GET_FAIL_TYPE,
    PRODUCTS_LIST_LOCK_TYPE,
    PRODUCTS_LIST_LOCK_SUCCESS_TYPE,
    PRODUCTS_LIST_LOCK_FAIL_TYPE,
    PRODUCTS_CONFIRM_TYPE,
    PRODUCTS_CONFIRM_SUCCESS_TYPE,
    PRODUCTS_CONFIRM_FAIL_TYPE,
    PRODUCTS_UNCONFIRM_TYPE,
    PRODUCTS_UNCONFIRM_SUCCESS_TYPE,
    PRODUCTS_UNCONFIRM_FAIL_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionProducts = {

    requestListProducts: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCTS_LIST_TYPE, data: initialState
            });

            await post(PRODUCTS_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCTS_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCTS_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCTS_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestListProductsAlert: () => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCTS_LIST_IN_ALERT_TYPE, data: initialState
            });

            await get(PRODUCTS_LIST_IN_ALERT)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCTS_LIST_IN_ALERT_SUCCESS_TYPE, data: { listInAlert: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCTS_LIST_IN_ALERT_FAIL_TYPE, data: { listInAlert: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCTS_LIST_IN_ALERT_FAIL_TYPE, data: { listInAlert: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestListProductsVerify: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCTS_LIST_VERIFY_TYPE, data: initialState
            });

            await post(PRODUCTS_LIST_VERIFY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCTS_LIST_VERIFY_SUCCESS_TYPE, data: { listVerify: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCTS_LIST_VERIFY_FAIL_TYPE, data: { listVerify: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCTS_LIST_VERIFY_FAIL_TYPE, data: { listVerify: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestVerifyProducts: (id) => async (dispatch, getState) => {
        dispatch({
            type: PRODUCTS_VERIFY_IMAGE_TYPE, data: initialState
        });

        return await get(PRODUCTS_VERIFY + id)
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
    requestUploadFileProducts: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCTS_UPLOAD_VERIFY_TYPE, data: initialState
            });

            await post(PRODUCTS_UPLOAD_VERIFY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCTS_UPLOAD_VERIFY_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCTS_UPLOAD_VERIFY_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCTS_UPLOAD_VERIFY_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteFileProducts: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCTS_DELETE_UPLOAD_VERIFY_TYPE, data: initialState
            });

            await get(PRODUCTS_DELETE_UPLOAD_VERIFY + data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCTS_UPLOAD_VERIFY_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCTS_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCTS_DELETE_UPLOAD_VERIFY_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetProducts: (id) => async (dispatch, getState) => {
        dispatch({
            type: PRODUCTS_GET_TYPE, data: initialState
        });

        return await get(PRODUCTS_GET + id)
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
    requestListLockProducts: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PRODUCTS_LIST_LOCK_TYPE, data: initialState
            });

            await post(PRODUCTS_LIST_LOCK, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: PRODUCTS_LIST_LOCK_SUCCESS_TYPE, data: { listLock: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: PRODUCTS_LIST_LOCK_FAIL_TYPE, data: { listLock: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCTS_LIST_LOCK_FAIL_TYPE, data: { listLock: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestConfirmProducts: (id) => async (dispatch, getState) => {
        dispatch({
            type: PRODUCTS_CONFIRM_TYPE, data: initialState
        });

        return await get(PRODUCTS_CONFIRM + id)
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
    requestUnConfirmProducts: (id) => async (dispatch, getState) => {
        dispatch({
            type: PRODUCTS_UNCONFIRM_TYPE, data: initialState
        });

        return await get(PRODUCTS_UNCONFIRM + id)
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