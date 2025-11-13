import {
    STAMPPROVIDE_LIST,
    STAMPPROVIDE_LIST_COMFIRM,
    STAMPPROVIDE_LIST_UNCOMFIRM,
    QRCODE_STAMPID,
    STAMPPROVIDE_DETAIL,
    STAMPPROVIDE_UPDATEDELIVERY,
    STAMPPROVIDE_PRINT,
    STAMPPROVIDE_HAS_DELIVERED,
    STAMPPROVIDE_HAS_PRINTED,
    STAMPPROVIDE_SENDMAIL,

    //STAMPREQUESTUSED
    STAMPREQUESTUSED_LIST,
    STAMPREQUESTUSED_LIST_COMFIRM,
    STAMPREQUESTUSED_LIST_UNCOMFIRM,

    STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT



} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_STAMPPROVIDE_LIST_TYPE,
    GET_STAMPPROVIDE_LIST_SUCCESS_TYPE,
    GET_STAMPPROVIDE_LIST_FAIL_TYPE,
    GET_COMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE,
    GET_COMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE,
    GET_COMFIRM_STAMPPROVIDE_LIST_TYPE,
    GET_UNCOMFIRM_STAMPPROVIDE_LIST_TYPE,
    GET_UNCOMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE,
    GET_UNCOMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE,
    GET_QRCODE_STAMPID_TYPE,
    GET_QRCODE_STAMPID_SUCCESS_TYPE,
    GET_QRCODE_STAMPID_FAIL_TYPE,
    GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_FAIL_TYPE,
    GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_SUCCESS_TYPE,
    GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_TYPE,
    STAMPPROVIDE_PRINT_TYPE,
    STAMPPROVIDE_PRINT_SUCCESS_TYPE,
    STAMPPROVIDE_PRINT_FAIL_TYPE,
    STAMPPROVIDE_HAS_PRINTED_TYPE,
    STAMPPROVIDE_HAS_PRINTED_SUCCESS_TYPE,
    STAMPPROVIDE_HAS_PRINTED_FAIL_TYPE,
    STAMPPROVIDE_HAS_DELIVERED_TYPE,
    STAMPPROVIDE_HAS_DELIVERED_SUCCESS_TYPE,
    STAMPPROVIDE_HAS_DELIVERED_FAIL_TYPE,
    STAMPPROVIDE_SENDMAIL_TYPE,
    STAMPPROVIDE_SENDMAIL_SUCCESS_TYPE,
    STAMPPROVIDE_SENDMAIL_FAIL_TYPE,

    //STAMPREQUESTUSED
    STAMPREQUESTUSED_LIST_COMFIRM_TYPE,
    STAMPREQUESTUSED_LIST_COMFIRM_SUCCESS_TYPE,
    STAMPREQUESTUSED_LIST_COMFIRM_FAIL_TYPE,

    STAMPREQUESTUSED_LIST_TYPE,
    STAMPREQUESTUSED_LIST_SUCCESS_TYPE,
    STAMPREQUESTUSED_LIST_FAIL_TYPE,

    STAMPREQUESTUSED_LIST_UNCOMFIRM_TYPE,
    STAMPREQUESTUSED_LIST_UNCOMFIRM_SUCCESS_TYPE,
    STAMPREQUESTUSED_LIST_UNCOMFIRM_FAIL_TYPE,

    STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_TYPE,
    STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_SUCCESS_TYPE,
    STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_FAIL_TYPE

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionStampProvideList = {
    requestStampProvideList: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_STAMPPROVIDE_LIST_TYPE, data: initialState
        });

        await post(STAMPPROVIDE_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_STAMPPROVIDE_LIST_SUCCESS_TYPE, data: { stampprovide: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_STAMPPROVIDE_LIST_FAIL_TYPE, data: { stampprovide: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_STAMPPROVIDE_LIST_FAIL_TYPE, data: { stampprovide: [], isLoading: true, status: false, message: err.message } });
            })
    },

    requestComfirmRequestPrintStampProvide: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_TYPE, data: initialState
            });

            return await get(STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_SUCCESS_TYPE, data: { confirmPrint: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_COMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE, data: { confirmPrint: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: STAMPPROVIDE_LIST_COMFIRM_REQUEST_PRINT_FAIL_TYPE, data: { confirmPrint: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    requestComfirmStampProvide: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_COMFIRM_STAMPPROVIDE_LIST_TYPE, data: initialState
            });

            return await get(STAMPPROVIDE_LIST_COMFIRM + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_COMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE, data: { confirm: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_COMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE, data: { confirm: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_COMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE, data: { confirm: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestUncomfirmStampProvide: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_QRCODE_STAMPID_TYPE, data: initialState
            });

            await post(STAMPPROVIDE_LIST_UNCOMFIRM, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_UNCOMFIRM_STAMPPROVIDE_LIST_SUCCESS_TYPE, data: { unconfirm: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_UNCOMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE, data: { unconfirm: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_UNCOMFIRM_STAMPPROVIDE_LIST_FAIL_TYPE, data: { unconfirm: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestUpdateDeliveryStampProvide: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_TYPE, data: initialState
            });

            await post(STAMPPROVIDE_UPDATEDELIVERY, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_SUCCESS_TYPE, data: { updateDelivery: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_FAIL_TYPE, data: { updateDelivery: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_STAMPPROVIDE_UPDATEDELIVERY_STAMPPROVIDE_LIST_FAIL_TYPE, data: { updateDelivery: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    printQR: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: GET_UNCOMFIRM_STAMPPROVIDE_LIST_TYPE, data: initialState
            });

            await get(QRCODE_STAMPID + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: GET_QRCODE_STAMPID_SUCCESS_TYPE, data: { print: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: GET_QRCODE_STAMPID_FAIL_TYPE, data: { print: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_QRCODE_STAMPID_FAIL_TYPE, data: { print: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    detail: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            const url = STAMPPROVIDE_DETAIL.replace('{0}', id);

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
                })
        })
    },
    printStamp: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: STAMPPROVIDE_PRINT_TYPE, data: initialState
            });

            await get(STAMPPROVIDE_PRINT + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: STAMPPROVIDE_PRINT_SUCCESS_TYPE, data: { printStamp: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: STAMPPROVIDE_PRINT_FAIL_TYPE, data: { printStamp: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: STAMPPROVIDE_PRINT_FAIL_TYPE, data: { printStamp: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    hasPrintStamp: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: STAMPPROVIDE_HAS_PRINTED_TYPE, data: initialState
            });

            await get(STAMPPROVIDE_HAS_PRINTED + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: STAMPPROVIDE_HAS_PRINTED_SUCCESS_TYPE, data: { hasPrinted: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: STAMPPROVIDE_HAS_PRINTED_FAIL_TYPE, data: { hasPrinted: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: STAMPPROVIDE_HAS_PRINTED_FAIL_TYPE, data: { hasPrinted: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    hasDeliveredStamp: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: STAMPPROVIDE_HAS_DELIVERED_TYPE, data: initialState
            });

            await get(STAMPPROVIDE_HAS_DELIVERED + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: STAMPPROVIDE_HAS_DELIVERED_SUCCESS_TYPE, data: { hasDelivered: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: STAMPPROVIDE_HAS_DELIVERED_FAIL_TYPE, data: { hasDelivered: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: STAMPPROVIDE_HAS_DELIVERED_FAIL_TYPE, data: { hasDelivered: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestSendMail: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: STAMPPROVIDE_SENDMAIL_TYPE, data: initialState
            });

            await get(STAMPPROVIDE_SENDMAIL + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: STAMPPROVIDE_SENDMAIL_SUCCESS_TYPE, data: { SendMail: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: STAMPPROVIDE_SENDMAIL_FAIL_TYPE, data: { SendMail: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: STAMPPROVIDE_SENDMAIL_FAIL_TYPE, data: { SendMail: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

    //STAMPREQUESTUSED
    requestStampRequestUsedList: (data) => async (dispatch, getState) => {
        dispatch({
            type: STAMPREQUESTUSED_LIST_TYPE, data: initialState
        });

        await post(STAMPREQUESTUSED_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: STAMPREQUESTUSED_LIST_SUCCESS_TYPE, data: { stamprequestused: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: STAMPREQUESTUSED_LIST_FAIL_TYPE, data: { stamprequestused: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: STAMPREQUESTUSED_LIST_FAIL_TYPE, data: { stamprequestused: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestComfirmStampRequestUsed: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: STAMPREQUESTUSED_LIST_COMFIRM_TYPE, data: initialState
            });

            return await get(STAMPREQUESTUSED_LIST_COMFIRM + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: STAMPREQUESTUSED_LIST_COMFIRM_SUCCESS_TYPE, data: { StampRequestUsedconfirm: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: STAMPREQUESTUSED_LIST_COMFIRM_FAIL_TYPE, data: { StampRequestUsedconfirm: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: STAMPREQUESTUSED_LIST_COMFIRM_FAIL_TYPE, data: { StampRequestUsedconfirm: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },
    requestUncomfirmStampRequestUsed: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: STAMPREQUESTUSED_LIST_UNCOMFIRM_TYPE, data: initialState
            });

            await post(STAMPREQUESTUSED_LIST_UNCOMFIRM, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: STAMPREQUESTUSED_LIST_UNCOMFIRM_SUCCESS_TYPE, data: { StampRequestUsedUnconfirm: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: STAMPREQUESTUSED_LIST_UNCOMFIRM_FAIL_TYPE, data: { StampRequestUsedUnconfirm: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: STAMPREQUESTUSED_LIST_UNCOMFIRM_FAIL_TYPE, data: { StampRequestUsedUnconfirm: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        })
    },

}