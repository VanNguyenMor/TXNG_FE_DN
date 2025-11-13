import {
    REPORTSP_MANGER_LIST

} from "../apis";
import {
    post, del, get
} from "../services/Dataservice";
import {
    SUCCESS_CODE,
    REPORTSP_MANGER_LIST_TYPE,
    REPORTSP_MANGER_LIST_SUCCESS_TYPE,
    REPORTSP_MANGER_LIST_FAIL_TYPE
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionReportSPMananger = {
    requestReportSPMananger: (data) => async (dispatch, getState) => {
        dispatch({
            type: REPORTSP_MANGER_LIST_TYPE, data: initialState
        });

        await post(REPORTSP_MANGER_LIST, data)
            .then(res => {
                if (res.status === SUCCESS_CODE) {
                    dispatch({
                        type: REPORTSP_MANGER_LIST_SUCCESS_TYPE, data: { list: res.data, isLoading: true, status: true, message: res.message }
                    });
                } else {
                    dispatch({
                        type: REPORTSP_MANGER_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: res.message }
                    });
                }
            })
            .catch(err => {
                dispatch({ type: REPORTSP_MANGER_LIST_FAIL_TYPE, data: { list: [], isLoading: true, status: false, message: err.message } });
            })
    }
}