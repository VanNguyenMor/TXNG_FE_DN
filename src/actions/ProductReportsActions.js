import {
    PRODUCT_REPORT_GET,
    PRODUCT_REPORT_GET_BY_GROUP,
    PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX,
    PRODUCT_REPORT_GET_PRODUCT_REPORT,
    PRODUCT_REPORT_GET_PRODUCT_REPORT_BY_GROUP,
    PRODUCT_REPORT_GET_PRODUCT_REPORT_BY_TYPE
} from "../apis";
import {
    get,
    post
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    PRODUCT_REPORT_GET_TYPE,
    PRODUCT_REPORT_GET_SUCCESS_TYPE,
    PRODUCT_REPORT_GET_FAIL_TYPE,
    PRODUCT_REPORT_GET_BY_GROUP_TYPE,
    PRODUCT_REPORT_GET_BY_GROUP_SUCCESS_TYPE,
    PRODUCT_REPORT_GET_BY_GROUP_FAIL_TYPE,
    PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX_SUCCESS_TYPE,
    PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX_FAIL_TYPE,
    PRODUCT_REPORT_GET_PRODUCT_REPORT_SUCCESS_TYPE,
    PRODUCT_REPORT_GET_PRODUCT_REPORT_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionProductReports = {
    requestGetProductReports: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({ type: PRODUCT_REPORT_GET_TYPE, data: initialState });
            if (!id) { id = '' }
            await get(PRODUCT_REPORT_GET + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCT_REPORT_GET_SUCCESS_TYPE, data: { get: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCT_REPORT_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_REPORT_GET_FAIL_TYPE, data: { get: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    requestProductByReportsGetByGroup: (id) => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({ type: PRODUCT_REPORT_GET_BY_GROUP_TYPE, data: initialState });
            if (!id) { id = '' }
            await get(PRODUCT_REPORT_GET_BY_GROUP + id)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCT_REPORT_GET_BY_GROUP_SUCCESS_TYPE, data: { getByGroup: res.data, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCT_REPORT_GET_BY_GROUP_FAIL_TYPE, data: { getByGroup: [], isLoading: true, status: false, message: res.message } });
                    }
                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_REPORT_GET_BY_GROUP_FAIL_TYPE, data: { getByGroup: [], isLoading: true, status: false, message: err.message } });
                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    getListFieldComboBox: data => async (dispatch, getState) => {
        return new Promise(async resolve => {
            dispatch({ type: PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX_SUCCESS_TYPE, data: [] });

            await post(PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX, data)
                .then(res => {
                    if (res.status === SUCCESS_CODE) {
                        dispatch({ type: PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX_SUCCESS_TYPE, data: { fields: (res.data || {}).fields, isLoading: true, status: true, message: res.message } });
                    } else {
                        dispatch({ type: PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX_FAIL_TYPE, data: { fields: [], isLoading: true, status: false, message: res.message } });
                    }

                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    dispatch({ type: PRODUCT_REPORT_GET_LIST_FIELD_COMBOBOX_FAIL_TYPE, data: { fields: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    getListProductReport: data => async (dispatch, getState) => {
        return new Promise(async resolve => {
            // dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_SUCCESS_TYPE, data: [] });

            // const api = PRODUCT_REPORT_GET_PRODUCT_REPORT_COMBOBOX.replace('{page}', data.page).replace('{limit}', data.limit).replace('{districtId}', data.districtId).replace('{wardId}', data.wardId).replace('{reportFilterType}', data.reportFilterType).replace('{month}', data.month).replace('{quarter}', data.quarter).replace('{year}', data.year).replace('{materialGroupId}', data.materialGroupId);

            await post(PRODUCT_REPORT_GET_PRODUCT_REPORT, data)
                .then(res => {
                    // if (res.status === SUCCESS_CODE) {
                    //     dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_SUCCESS_TYPE, data: { productReports: (res.data || {}).data || [], isLoading: true, status: true, message: res.message } });
                    // } else {
                    //     dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_FAIL_TYPE, data: { productReports: [], isLoading: true, status: false, message: res.message } });
                    // }

                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    // dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_FAIL_TYPE, data: { productReports: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    getListProductReportByGroup: data => async (dispatch, getState) => {
        return new Promise(async resolve => {
            // dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_SUCCESS_TYPE, data: [] });

            // const api = PRODUCT_REPORT_GET_PRODUCT_REPORT_COMBOBOX.replace('{page}', data.page).replace('{limit}', data.limit).replace('{districtId}', data.districtId).replace('{wardId}', data.wardId).replace('{reportFilterType}', data.reportFilterType).replace('{month}', data.month).replace('{quarter}', data.quarter).replace('{year}', data.year).replace('{materialGroupId}', data.materialGroupId);

            await post(PRODUCT_REPORT_GET_PRODUCT_REPORT_BY_GROUP, data)
                .then(res => {
                    // if (res.status === SUCCESS_CODE) {
                    //     dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_SUCCESS_TYPE, data: { productReportByGroups: (res.data || {}).data || [], isLoading: true, status: true, message: res.message } });
                    // } else {
                    //     dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_FAIL_TYPE, data: { productReportByGroups: [], isLoading: true, status: false, message: res.message } });
                    // }

                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    // dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_FAIL_TYPE, data: { productReportByGroups: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    },
    getListProductReportByType: data => async (dispatch, getState) => {
        return new Promise(async resolve => {
            // dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_SUCCESS_TYPE, data: [] });

            // const api = PRODUCT_REPORT_GET_PRODUCT_REPORT_COMBOBOX.replace('{page}', data.page).replace('{limit}', data.limit).replace('{districtId}', data.districtId).replace('{wardId}', data.wardId).replace('{reportFilterType}', data.reportFilterType).replace('{month}', data.month).replace('{quarter}', data.quarter).replace('{year}', data.year).replace('{materialGroupId}', data.materialGroupId);

            await post(PRODUCT_REPORT_GET_PRODUCT_REPORT_BY_TYPE, data)
                .then(res => {
                    // if (res.status === SUCCESS_CODE) {
                    //     dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_SUCCESS_TYPE, data: { productReportByGroups: (res.data || {}).data || [], isLoading: true, status: true, message: res.message } });
                    // } else {
                    //     dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_FAIL_TYPE, data: { productReportByGroups: [], isLoading: true, status: false, message: res.message } });
                    // }

                    resolve({
                        status: true,
                        data: res
                    });
                })
                .catch(err => {
                    // dispatch({ type: PRODUCT_REPORT_GET_PRODUCT_REPORT_GROUP_FAIL_TYPE, data: { productReportByGroups: [], isLoading: true, status: false, message: err.message } });

                    resolve({
                        status: false,
                        error: err
                    });
                });
        });
    }
}