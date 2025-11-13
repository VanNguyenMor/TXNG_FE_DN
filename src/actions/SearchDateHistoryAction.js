import {
    LOG_LIST
} from "../apis";
import {
    get, post, del
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    GET_LOG_LIST_TYPE,
    GET_LOG_LIST_SUCCESS_TYPE,
    GET_LOG_LIST_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionGetListDate = {
    requestLogListStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_LOG_LIST_TYPE, data: initialState
        });

        await post(LOG_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({ type: GET_LOG_LIST_SUCCESS_TYPE, data: { log: res.data, isLoading: true, status: true, message: res.message } });
                } else {
                    dispatch({ type: GET_LOG_LIST_FAIL_TYPE, data: { log: [], isLoading: true, status: false, message: res.message } });
                }
            })
            .catch(err => {
                dispatch({ type: GET_LOG_LIST_FAIL_TYPE, data: { log: [], isLoading: true, status: false, message: err.message } });
            })
    },
}