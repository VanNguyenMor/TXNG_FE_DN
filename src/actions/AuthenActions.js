import { USER_LOGIN, USER_LOGOUT, USER_UPDATE_ME } from "../apis";
import { setCookie } from "../helpers/cookie";
import { post, get } from "../services/Dataservice";
import {
  SUCCESS_CODE,
  GET_LOGIN_TYPE,
  GET_OUT_TYPE,
  GET_LOGIN_SUCCESS_TYPE,
  GET_LOGIN_FAIL_TYPE,
  USER_UPDATE_ME_SUCCESS,
  USER_UPDATE_ME_TYPE,
  USER_UPDATE_ME_FAIL,
  AUTHENTICATE_LOGIN_SUCCESS
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const actionCreators = {
  loginSuccess: () => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: AUTHENTICATE_LOGIN_SUCCESS });
    })
  },
  userLogin: (data, callBack) => async (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({ type: GET_LOGIN_SUCCESS_TYPE, data: { data, isLoading: true, status: true, message: '' } });

      // dispatch({ type: GET_LOGIN_TYPE, data: initialState });

      // await get(USER_LOGIN).then(res => {
      //     if (res.status === SUCCESS_CODE) {
      //         dispatch({ type: GET_LOGIN_SUCCESS_TYPE, data: { data: res.data, isLoading: true, status: true, message: res.message } });

      //         // Set Cookie account info
      //         //setCookie('AUTHEN_INFO', JSON.stringify(res.data));
      //     } else {
      //         dispatch({ type: GET_LOGIN_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: res.message } });
      //     }

      //     if (callBack) {
      //         callBack(res);
      //     }
      //     resolve({
      //         status: true,
      //         data: res
      //     });
      // })
      //     .catch(err => {
      //         dispatch({ type: GET_LOGIN_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: err.message } });

      //         if (callBack) {
      //             callBack(err);
      //         }
      //         resolve({
      //             status: false,
      //             error: err
      //         });
      //     });
    });
  },

  userLogout: () => async (dispatch, getState) => {
    dispatch({
      type: GET_OUT_TYPE, data: initialState
    });

    return await get(USER_LOGOUT);
  },

  updateMe: (data) => (dispatch, getState) => {
    return new Promise(async resolve => {
      dispatch({
        type: USER_UPDATE_ME_TYPE, data: initialState
      });

      await post(USER_UPDATE_ME, data)
        .then(res => {
          if (res.status === SUCCESS_CODE) {
            dispatch({ type: USER_UPDATE_ME_SUCCESS, data: { updateMe: res.data, isLoading: true, status: true, message: res.message } });
          } else {
            dispatch({ type: USER_UPDATE_ME_FAIL, data: { updateMe: [], isLoading: true, status: false, message: res.message } });
          }
          resolve({
            status: true,
            data: res
          });
        })
        .catch(err => {
          dispatch({ type: USER_UPDATE_ME_FAIL, data: { updateMe: [], isLoading: true, status: false, message: err.message } });
          resolve({
            status: false,
            error: err
          });
        })
    });
  },
};