import {
    PLANTINGTYPE_LIST,
    PLANTINGTYPE_LIST_CREATE, 
    PLANTINGTYPE_LIST_DELETE
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_PLANTINGTYPE_LIST_TYPE,
    GET_PLANTINGTYPE_LIST_SUCCESS_TYPE, 
    GET_PLANTINGTYPE_LIST_FAIL_TYPE,
    GET_CREATE_PLANTINGTYPE_LIST_TYPE,
    GET_CREATE_PLANTINGTYPE_LIST_SUCCESS_TYPE,
    GET_CREATE_PLANTINGTYPE_LIST_FAIL_TYPE,
    GET_DELETE_PLANTINGTYPE_LIST_TYPE,
    GET_DELETE_PLANTINGTYPE_LIST_SUCCESS_TYPE,
    GET_DELETE_PLANTINGTYPE_LIST_FAIL_TYPE,
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionPLANTINGTYPEList = {
    requestPLANTINGTYPEList: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_PLANTINGTYPE_LIST_TYPE, data: initialState
        });
    
        await post(PLANTINGTYPE_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: GET_PLANTINGTYPE_LIST_SUCCESS_TYPE, data: { plantingtype: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: GET_PLANTINGTYPE_LIST_FAIL_TYPE, data: { plantingtype: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: GET_PLANTINGTYPE_LIST_FAIL_TYPE, data: { plantingtype: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestCreatePLANTINGTYPE: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_CREATE_PLANTINGTYPE_LIST_TYPE, data: initialState
        });

        await post(PLANTINGTYPE_LIST_CREATE, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_CREATE_PLANTINGTYPE_LIST_SUCCESS_TYPE, data: { plantingtype: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_CREATE_PLANTINGTYPE_LIST_FAIL_TYPE, data: { plantingtype: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_CREATE_PLANTINGTYPE_LIST_FAIL_TYPE, data: { plantingtype: [], isLoading: true, status: false, message: err.message } });
            })
    },
    requestDeletePLANTINGTYPE: (id) => async (dispatch, getState) => {
        dispatch({
            type: GET_DELETE_PLANTINGTYPE_LIST_TYPE, data: initialState
        });

        return await del(PLANTINGTYPE_LIST_DELETE + id)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_DELETE_PLANTINGTYPE_LIST_SUCCESS_TYPE, data: { plantingtype: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_DELETE_PLANTINGTYPE_LIST_FAIL_TYPE, data: { plantingtype: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_DELETE_PLANTINGTYPE_LIST_FAIL_TYPE, data: { plantingtype: [], isLoading: true, status: false, message: err.message } });
            })
    },
}