import {
    REGISTERED_FEE_LIST,
    REGISTERED_FEE_COMFIRM
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_REGISTEREDFEE_LIST_TYPE,
    GET_REGISTEREDFEE_LIST_SUCCESS_TYPE,
    GET_REGISTEREDFEE_LIST_FAIL_TYPE,
    GET_REGISTEREDFEE_COMFIRM_TYPE,
    GET_REGISTEREDFEE_COMFIRM_FAIL_TYPE,
    GET_REGISTEREDFEE_COMFIRM_SUCCESS_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionRegisteredFee = {
    requestRegisteredFee: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_REGISTEREDFEE_LIST_TYPE, data: initialState
        });

        await post(REGISTERED_FEE_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_REGISTEREDFEE_LIST_SUCCESS_TYPE, data: { registered: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_REGISTEREDFEE_LIST_FAIL_TYPE, data: { registered: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_REGISTEREDFEE_LIST_FAIL_TYPE, data: { registered: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestComfirm: (id) => async (dispatch, getState) => {
        dispatch({ type: GET_REGISTEREDFEE_COMFIRM_TYPE, data: initialState });

        return await get(REGISTERED_FEE_COMFIRM + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_REGISTEREDFEE_COMFIRM_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_REGISTEREDFEE_COMFIRM_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_REGISTEREDFEE_COMFIRM_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
            })
    },
}