import {
    CONFIG_WEBSITE_GET,
    CONFIG_WEBSITE_UPDATE,
} from "../apis";
import {
    get, post, del, postFormData
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    CONFIG_WEBSITE_GET_TYPE,
    CONFIG_WEBSITE_GET_SUCCESS_TYPE,
    CONFIG_WEBSITE_GET_FAIL_TYPE,
    CONFIG_WEBSITE_UPDATE_TYPE,
    CONFIG_WEBSITE_UPDATE_SUCCESS_TYPE,
    CONFIG_WEBSITE_UPDATE_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionConfigWebsite = {
    requestGetConfigWebsite: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: CONFIG_WEBSITE_GET_TYPE, data: initialState
            });

            await get(CONFIG_WEBSITE_GET)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: CONFIG_WEBSITE_GET_SUCCESS_TYPE, data: { getConfig: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: CONFIG_WEBSITE_GET_FAIL_TYPE, data: { getConfig: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: CONFIG_WEBSITE_GET_FAIL_TYPE, data: { getConfig: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },

    requestUpdateConfigWebsite: (data) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({
                type: CONFIG_WEBSITE_UPDATE_TYPE, data: initialState
            });

            await postFormData(CONFIG_WEBSITE_UPDATE, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({
                            type: CONFIG_WEBSITE_UPDATE_SUCCESS_TYPE, data: { updateConfig: res.data, isLoading: true, status: true, message: res.message }
                        });
                    } else {
                        dispatch({
                            type: CONFIG_WEBSITE_UPDATE_FAIL_TYPE, data: { updateConfig: [], isLoading: true, status: false, message: res.message }
                        });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: CONFIG_WEBSITE_UPDATE_FAIL_TYPE, data: { updateConfig: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                })
        });
    },


}