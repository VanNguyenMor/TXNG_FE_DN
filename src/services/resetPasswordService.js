import axios from "axios";
import { DOMAIN } from "./Common";
import { ACCOUNTS } from "../views/pages/SummaryReport/example-api";

/**
 * checkLinkForgotPassword: kiểm tra link reset password còn hợp lệ
 */
export const checkLinkForgotPassword = async (username, shortLinkId) => {
  try {
    const url = `${DOMAIN}api/${ACCOUNTS.checkLinkForgotPassword.replace('{0}', username).replace('{1}', shortLinkId)}`;
    const response = await axios.get(url, {
      headers: {
        "Cache-Control": "no-store",
      },
      withCredentials: false,
    });

    return {
      status: response.status,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;
    throw { status, message };
  }
};

/**
 * changePasswordForForgotPassword: đổi mật khẩu cho forgot password
 */
export const changePasswordForForgotPassword = async ({ username, shortLinkId, password, repeatPassword }) => {
  try {
    const url = `${DOMAIN}api/${ACCOUNTS.changePasswordForForgotPassword}`;
    const response = await axios.post(
      url,
      { 
        Username: username, 
        ShortLinkId: shortLinkId, 
        Password: password, 
        RepeatPassword: repeatPassword 
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        withCredentials: false,
      }
    );

    return {
      status: response.status,
      data: response.data,
      message: response.data?.message,
    };
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;
    throw { status, message };
  }
};
