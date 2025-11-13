import {
    FIELD_TYPE_LIST,
} from "../apis";
import {
    post
} from "../services/Dataservice";
import {
    GET_FIELD_TYPE_TYPE,
    GET_FIELD_TYPE_SUCCESS_TYPE,
    GET_FIELD_TYPE_FAIL_TYPE,
    SUCCESS_CODE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionFieldType = {
    requestFieldTypeStore: (data) => async (dispatch, getState) => {
        dispatch({
            type: GET_FIELD_TYPE_TYPE, data: initialState
        });

        return new Promise(async resolve => {
            dispatch({
                type: GET_FIELD_TYPE_TYPE, data: initialState
            });
            await post(FIELD_TYPE_LIST, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: GET_FIELD_TYPE_SUCCESS_TYPE, data: { fieldTypes: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: GET_FIELD_TYPE_FAIL_TYPE, data: { fieldTypes: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: GET_FIELD_TYPE_FAIL_TYPE, data: { fieldTypes: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        })
    }
}