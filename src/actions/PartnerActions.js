import {
    PARTNER_LIST,
    PARTNER_CREATE,
    PARTNER_DELETE,
    PARTNER_UPDATE,
    PARTNER_GET,
    PARTNER_LIST_VERIFY,
    PARTNER_LIST_MANIFEST_VERIFY,
    PARTNER_LIST_TRANSPORTS_VERIFY,
    PARTNER_VERIFY,
    PARTNER_UPLOAD_VERIFY,
    PARTNER_DELETE_UPLOAD_VERIFY,
    PARTNER_LACO
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    PARTNER_LIST_TYPE,
    PARTNER_LIST_SUCCESS_TYPE,
    PARTNER_LIST_FAIL_TYPE,
    PARTNER_CREATE_TYPE,
    PARTNER_CREATE_SUCCESS_TYPE,
    PARTNER_CREATE_FAIL_TYPE,
    PARTNER_GET_TYPE,
    PARTNER_GET_SUCCESS_TYPE,
    PARTNER_GET_FAIL_TYPE,
    PARTNER_UPDATE_TYPE,
    PARTNER_UPDATE_SUCCESS_TYPE,
    PARTNER_UPDATE_FAIL_TYPE,
    PARTNER_DELETE_TYPE,
    PARTNER_DELETE_SUCCESS_TYPE,
    PARTNER_DELETE_FAIL_TYPE,

    PARTNER_LIST_VERIFY_TYPE,
    PARTNER_LIST_VERIFY_SUCCESS_TYPE,
    PARTNER_LIST_VERIFY_FAIL_TYPE,
    PARTNER_LIST_MANIFEST_VERIFY_TYPE,
    PARTNER_LIST_MANIFEST_VERIFY_SUCCESS_TYPE,
    PARTNER_LIST_MANIFEST_VERIFY_FAIL_TYPE,
    PARTNER_LIST_TRANSPORTS_VERIFY_TYPE,
    PARTNER_LIST_TRANSPORTS_VERIFY_SUCCESS_TYPE,
    PARTNER_LIST_TRANSPORTS_VERIFY_FAIL_TYPE,
    PARTNER_VERIFY_IMAGE_TYPE,
    PARTNER_VERIFY_IMAGE_SUCCESS_TYPE,
    PARTNER_VERIFY_IMAGE_FAIL_TYPE,
    PARTNER_DELETE_UPLOAD_VERIFY_TYPE,
    PARTNER_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE,
    PARTNER_DELETE_UPLOAD_VERIFY_FAIL_TYPE,
    PARTNER_UPLOAD_VERIFY_TYPE,
    PARTNER_UPLOAD_VERIFY_SUCCESS_TYPE,
    PARTNER_UPLOAD_VERIFY_FAIL_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionPartner = {
    requestListPartner: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_LIST_TYPE, data: initialState
            });

            await post(PARTNER_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestGetPartner: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_GET_TYPE, data: initialState
            });

            return await get(PARTNER_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        })
    },
    requestCreatePartner: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_CREATE_TYPE, data: initialState
            });

            await post(PARTNER_CREATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: PARTNER_CREATE_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: PARTNER_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_CREATE_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestUpdatePartner: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_UPDATE_TYPE, data: initialState
            });

            await post(PARTNER_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: PARTNER_UPDATE_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: PARTNER_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_UPDATE_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestListPartnerLACO: (params) => async (dispatch, getState) => {
        // params: { name, code, companyId }
        return new Promise(async resolve => {
            const name = encodeURIComponent((params && params.name) || '');
            const code = encodeURIComponent((params && params.code) || '');
            const companyId = encodeURIComponent((params && params.companyId) || '');
            const url = `${PARTNER_LACO}?name=${name}&code=${code}&companyId=${companyId}`;

            await get(url)
                .then(res => {
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    requestDeletePartner: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_DELETE_TYPE, data: initialState
            });
            
            return await del(PARTNER_DELETE + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_DELETE_SUCCESS_TYPE, data: { delete: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_DELETE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_DELETE_FAIL_TYPE, data: { delete: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestListPartnerVerify: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_LIST_VERIFY_TYPE, data: initialState
            });

            await post(PARTNER_LIST_VERIFY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_LIST_VERIFY_SUCCESS_TYPE, data: { listVerify: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_LIST_VERIFY_FAIL_TYPE, data: { listVerify: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_LIST_VERIFY_FAIL_TYPE, data: { listVerify: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestListManufestPartnerVerify: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_LIST_MANIFEST_VERIFY_TYPE, data: initialState
            });

            await post(PARTNER_LIST_MANIFEST_VERIFY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_LIST_MANIFEST_VERIFY_SUCCESS_TYPE, data: { listManuVerify: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_LIST_MANIFEST_VERIFY_FAIL_TYPE, data: { listManuVerify: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_LIST_VERIFY_FAIL_TYPE, data: { listManuVerify: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestListTranformPartnerVerify: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_LIST_TRANSPORTS_VERIFY_TYPE, data: initialState
            });

            await post(PARTNER_LIST_TRANSPORTS_VERIFY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_LIST_TRANSPORTS_VERIFY_SUCCESS_TYPE, data: { listTranVerify: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_LIST_TRANSPORTS_VERIFY_FAIL_TYPE, data: { listTranVerify: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_LIST_TRANSPORTS_VERIFY_FAIL_TYPE, data: { listTranVerify: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestVerifyPartner: (id) => async (dispatch, getState) => {
        dispatch({
            type: PARTNER_VERIFY_IMAGE_TYPE, data: initialState
        });

        return await get(PARTNER_VERIFY + id)
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
    requestUploadFilePartner: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_UPLOAD_VERIFY_TYPE, data: initialState
            });

            await post(PARTNER_UPLOAD_VERIFY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_UPLOAD_VERIFY_SUCCESS_TYPE, data: { upload: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_UPLOAD_VERIFY_FAIL_TYPE, data: { upload: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_UPLOAD_VERIFY_FAIL_TYPE, data: { upload: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestDeleteFilePartner: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: PARTNER_DELETE_UPLOAD_VERIFY_TYPE, data: initialState
            });

            await get(PARTNER_DELETE_UPLOAD_VERIFY + data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PARTNER_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE, data: { delUpload: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PARTNER_DELETE_UPLOAD_VERIFY_FAIL_TYPE, data: { delUpload: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PARTNER_DELETE_UPLOAD_VERIFY_FAIL_TYPE, data: { delUpload: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
}