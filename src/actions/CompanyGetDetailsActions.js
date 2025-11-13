import {
  COMPANY_GET_DETAILS,
  COMPANY_GET_FILEUPDATE,
  COMPANY_LIST_VERIFY,
  COMPANY_VERIFY_IMAGE,
  COMPANY_UPLOAD_VERIFY,
  COMPANY_DELETE_UPLOAD_VERIFY

} from "../apis";
import {
  get, post, del
} from "../services/Dataservice";
import {
  SUCCESS_CODE,
  GET_COMPANY_GET_DETAILS_TYPE,
  GET_COMPANY_GET_DETAILS_SUCCESS_TYPE,
  GET_COMPANY_GET_DETAILS_FAIL_TYPE,
  GET_COMPANY_GET_FILEUPDATE_FAIL_TYPE,
  GET_COMPANY_GET_FILEUPDATE_TYPE,
  GET_COMPANY_GET_FILEUPDATE_SUCCESS_TYPE,
  COMPANY_LIST_VERIFY_TYPE,
  COMPANY_LIST_VERIFY_SUCCESS_TYPE,
  COMPANY_LIST_VERIFY_FAIL_TYPE,
  COMPANY_VERIFY_IMAGE_TYPE,
  COMPANY_VERIFY_IMAGE_SUCCESS_TYPE,
  COMPANY_VERIFY_IMAGE_FAIL_TYPE,
  COMPANY_UPLOAD_VERIFY_TYPE,
  COMPANY_UPLOAD_VERIFY_SUCCESS_TYPE,
  COMPANY_UPLOAD_VERIFY_FAIL_TYPE,
  COMPANY_DELETE_UPLOAD_VERIFY_TYPE,
  COMPANY_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE,
  COMPANY_DELETE_UPLOAD_VERIFY_FAIL_TYPE,

} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCompanyGetDetails = {

  requestCompanyGetDetails: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_COMPANY_GET_DETAILS_TYPE, data: initialState });

      await get(COMPANY_GET_DETAILS + id)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_COMPANY_GET_DETAILS_SUCCESS_TYPE, data: { details: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: GET_COMPANY_GET_DETAILS_FAIL_TYPE, data: { details: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_COMPANY_GET_DETAILS_FAIL_TYPE, data: { details: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },
  requestCompanyGetFileUpdate: (id) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_COMPANY_GET_FILEUPDATE_TYPE, data: initialState });

      await get(COMPANY_GET_FILEUPDATE + id)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: GET_COMPANY_GET_FILEUPDATE_SUCCESS_TYPE, data: { fileUpdate: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: GET_COMPANY_GET_FILEUPDATE_FAIL_TYPE, data: { fileUpdate: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: GET_COMPANY_GET_FILEUPDATE_FAIL_TYPE, data: { fileUpdate: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        });
    });
  },
  requestListCompanyVerify: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: COMPANY_LIST_VERIFY_TYPE, data: initialState
      });

      await post(COMPANY_LIST_VERIFY, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: COMPANY_LIST_VERIFY_SUCCESS_TYPE, data: { listVerify: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: COMPANY_LIST_VERIFY_FAIL_TYPE, data: { listVerify: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: COMPANY_LIST_VERIFY_FAIL_TYPE, data: { listVerify: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        })
    })
  },
  requestVerifyCompany: (id) => async (dispatch, getState) => {
    dispatch({
      type: COMPANY_VERIFY_IMAGE_TYPE, data: initialState
    });

    return await get(COMPANY_VERIFY_IMAGE + id)
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
  requestUploadFileCompany: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: COMPANY_UPLOAD_VERIFY_TYPE, data: initialState
      });

      await post(COMPANY_UPLOAD_VERIFY, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: COMPANY_UPLOAD_VERIFY_SUCCESS_TYPE, data: { upload: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: COMPANY_UPLOAD_VERIFY_FAIL_TYPE, data: { upload: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: COMPANY_UPLOAD_VERIFY_FAIL_TYPE, data: { upload: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        })
    })
  },
  requestDeleteFileCompany: (data) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: COMPANY_DELETE_UPLOAD_VERIFY_TYPE, data: initialState
      });

      await get(COMPANY_DELETE_UPLOAD_VERIFY + data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: COMPANY_DELETE_UPLOAD_VERIFY_SUCCESS_TYPE, data: { deleteUpload: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: COMPANY_DELETE_UPLOAD_VERIFY_FAIL_TYPE, data: { deleteUpload: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: COMPANY_DELETE_UPLOAD_VERIFY_FAIL_TYPE, data: { deleteUpload: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        })
    })
  },
}