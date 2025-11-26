import { getCookie } from "../helpers/cookie";
import { getUrlCompanyAPI } from "../utils/service";
import axios from "axios";

export const GET_ACCOUNT_LIST_NEW_TYPE = "GET_ACCOUNT_LIST_NEW_TYPE";
export const GET_ACCOUNT_LIST_NEW_SUCCESS_TYPE =
  "GET_ACCOUNT_LIST_NEW_SUCCESS_TYPE";
export const GET_ACCOUNT_LIST_NEW_FAIL_TYPE = "GET_ACCOUNT_LIST_NEW_FAIL_TYPE";

const SUCCESS_CODE = 200;
const initialState = {
  accounts: [],
  isLoading: false,
  status: null,
  message: null,
};

export const actionAccountCreatorsNew = {
  getAllAccountListNew: (data) => async (dispatch, getState) => {
    return new Promise(async (resolve) => {
      dispatch({ type: GET_ACCOUNT_LIST_NEW_TYPE, data: initialState });

      try {
        const authenInfoString = getCookie("AUTHEN_INFO");

        if (!authenInfoString) {
          throw new Error("Chưa đăng nhập hoặc không tìm thấy token.");
        }

        const authenInfo = JSON.parse(authenInfoString);
        const token = authenInfo.token;

        if (!token) {
          throw new Error("Token không hợp lệ.");
        }

        const url = getUrlCompanyAPI("user/getall");

        const config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        const response = await axios.post(url, data, config);

        if (response.status === SUCCESS_CODE) {
          dispatch({
            type: GET_ACCOUNT_LIST_NEW_SUCCESS_TYPE,
            data: {
              accounts: response.data,
              isLoading: false,
              status: true,
              message: response.data.message || "Thành công",
            },
          });

          resolve({
            status: true,
            data: response.data,
          });
        } else {
          dispatch({
            type: GET_ACCOUNT_LIST_NEW_FAIL_TYPE,
            data: {
              accounts: [],
              isLoading: false,
              status: false,
              message: response.data.message || "Lỗi logic API",
            },
          });

          resolve({
            status: false,
            data: response.data,
          });
        }
      } catch (err) {
        const errorMessage = err.message || "Lỗi gọi API không xác định.";

        dispatch({
          type: GET_ACCOUNT_LIST_NEW_FAIL_TYPE,
          data: {
            accounts: [],
            isLoading: false,
            status: false,
            message: errorMessage,
          },
        });

        resolve({
          status: false,
          error: err,
        });
      }
    });
  },
};
