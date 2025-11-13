import {
	USER_LIST_ACCOUNT_LIST,
	USER_GET_INFO,
	USER_UPDATE_INFO,
	USER_CREATE_INFO,
	USER_CREATE_INFO_PRINTER,
	USER_DELETE_INFO,
	USER_SEND_FORGOT_PASSWORD,
	USER_CHECK_FORGOT_PASSWORD,
	USER_CHANGE_PASS_FORGOEt_PASSWORD,
	USER_UPDATE_ME,
	USER_CHANGE_PASSWORD
} from "../apis";

import {
	get, post, del, postFormData
} from "../services/Dataservice";

import {
	SUCCESS_CODE,
	GET_USER_LIST_TYPE,
	GET_USER_LIST_SUCCESS_TYPE,
	GET_USER_LIST_FAIL_TYPE,
	GET_USER_INFO_TYPE,
	GET_USER_INFO_SUCCESS_TYPE,
	GET_USER_INFO_FAIL_TYPE,
	UPDATE_USER_INFO_TYPE,
	UPDATE_USER_INFO_SUCCESS_TYPE,
	UPDATE_USER_INFO_FAIL_TYPE,
	CREATE_USER_INFO_TYPE,
	CREATE_USER_PRINTER_INFO_TYPE,
	CREATE_USER_INFO_SUCCESS_TYPE,
	CREATE_USER_INFO_FAIL_TYPE,
	DELETE_USER_INFO_TYPE,
	CHECK_FORGOT_PASSWORD_SUCCESS,
	CHANGE_PASSWORD_FORGOT_PASSWORD_SUCCESS,
	USER_UPDATE_ME_SUCCESS,
	USER_UPDATE_ME_TYPE,
	USER_UPDATE_ME_FAIL,
	USER_CHANGE_PASSWORD_TYPE,
	USER_CHANGE_PASSWORD_SUCCESS,
	USER_CHANGE_PASSWORD_FAIL
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: false, message: '' };

export const actionCreators = {

	requestUserListStore: (data) => async (dispatch, getState) => {
		return new Promise(async resolve => {
			dispatch({ type: GET_USER_LIST_TYPE, data: initialState });

			await post(USER_LIST_ACCOUNT_LIST, data)
				.then(res => {
					if (res.status === SUCCESS_CODE) {
						dispatch({ type: GET_USER_LIST_SUCCESS_TYPE, data: { data: res.data, isLoading: true, status: true, message: res.message } });
					} else {
						dispatch({ type: GET_USER_LIST_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: res.message } });
					}
					resolve({
						status: true,
						data: res
					});
				})
				.catch(err => {
					dispatch({ type: GET_USER_LIST_FAIL_TYPE, data: { data: [], isLoading: true, status: false, message: err.message } });
					resolve({
						status: false,
						error: err
					});
				});
		});
	},

	getUserInfo: (id) => async (dispatch, getState) => {
		return new Promise(async resolve => {
			dispatch({
				type: GET_USER_INFO_TYPE, data: initialState
			});

			await get(USER_GET_INFO + id)
				.then(res => {
					if (res.status === SUCCESS_CODE) {
						dispatch({ type: GET_USER_INFO_SUCCESS_TYPE, data: { detail: res.data, isLoading: true, status: true, message: res.message } });
					} else {
						dispatch({ type: GET_USER_INFO_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: res.message } });
					}
					resolve({
						status: true,
						data: res
					});
				})
				.catch(err => {
					dispatch({ type: GET_USER_INFO_FAIL_TYPE, data: { detail: [], isLoading: true, status: false, message: err.message } });
					resolve({
						status: false,
						error: err
					});
				});
		});
	},

	updateUserInfo: (data) => async (dispatch, getState) => {
		return new Promise(async resolve => {
			dispatch({ type: UPDATE_USER_INFO_TYPE, data: initialState });

			await postFormData(USER_UPDATE_INFO, data)
				.then(res => {
					if (res.status === SUCCESS_CODE) {
						//dispatch({ type: UPDATE_USER_INFO_SUCCESS_TYPE, data: { update: res.data, isLoading: true, status: true, message: res.message } });
					} else {
						//dispatch({ type: UPDATE_USER_INFO_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: res.message } });
					}
					resolve({
						status: true,
						data: res
					});
				})
				.catch(err => {
					//dispatch({ type: UPDATE_USER_INFO_FAIL_TYPE, data: { update: [], isLoading: true, status: false, message: err.message } });
					resolve({
						status: false,
						error: err
					});
				});
		});
	},

	deleteUserInfo: (id) => async (dispatch, getState) => {
		return new Promise(async resolve => {
			dispatch({ type: DELETE_USER_INFO_TYPE, data: initialState });

			return await del(USER_DELETE_INFO + id).then(res => {

				resolve({
					status: true,
					data: res
				});
			}).catch(err => {
				resolve({
					status: false,
					error: err
				});
			})
		})
	},

	createUserInfo: (data) => async (dispatch, getState) => {
		return new Promise(async resolve => {
			dispatch({ type: CREATE_USER_INFO_TYPE, data: initialState });

			await postFormData(USER_CREATE_INFO, data)
				.then(res => {
					if (res.status === SUCCESS_CODE) {
						// dispatch({ type: CREATE_USER_INFO_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message } });
					} else {
						// dispatch({ type: CREATE_USER_INFO_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message } });
					}

					resolve({
						status: true,
						data: res
					});
				})
				.catch(err => {
					// dispatch({ type: CREATE_USER_INFO_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });

					resolve({
						status: false,
						error: err
					});
				});
		});
	},

	createUserInfoPrinter: (data) => async (dispatch, getState) => {
		return new Promise(async resolve => {
			dispatch({ type: CREATE_USER_PRINTER_INFO_TYPE, data: initialState });

			await postFormData(USER_CREATE_INFO_PRINTER, data)
				.then(res => {
					if (res.status === SUCCESS_CODE) {
						// dispatch({ type: CREATE_USER_INFO_SUCCESS_TYPE, data: { create: res.data, isLoading: true, status: true, message: res.message } });
					} else {
						// dispatch({ type: CREATE_USER_INFO_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: res.message } });
					}

					resolve({
						status: true,
						data: res
					});
				})
				.catch(err => {
					// dispatch({ type: CREATE_USER_INFO_FAIL_TYPE, data: { create: [], isLoading: true, status: false, message: err.message } });

					resolve({
						status: false,
						error: err
					});
				});
		});
	},

	sendForgotPassword: data => (_, __) => {
		return new Promise(resolve => {
			post(USER_SEND_FORGOT_PASSWORD, data).then(res => {
				if (res.status == 200) {
					resolve({
						ok: true,
						data: res
					});
				} else {
					resolve({
						ok: false,
						error: res
					});
				}
			}).catch(err => {
				resolve({
					ok: false,
					error: err
				});
			});
		});
	},

	checkForgotPassword: data => (_, __) => {
		return new Promise(resolve => {
			get(CHECK_FORGOT_PASSWORD_SUCCESS, data).then(res => {
				if (res.data.status == 200) {
					resolve({
						ok: true,
						data: res
					});
				} else {
					resolve({
						ok: false,
						error: res
					});
				}
			}).catch(err => {
				resolve({
					ok: false,
					error: err
				});
			});
		});
	},

	changePassForgotPassword: data => (_, __) => {
		return new Promise(resolve => {
			post(CHANGE_PASSWORD_FORGOT_PASSWORD_SUCCESS, data).then(res => {
				if (res.data.status == 200) {
					resolve({
						ok: true,
						data: res
					});
				} else {
					resolve({
						ok: false,
						error: res
					});
				}
			}).catch(err => {
				resolve({
					ok: false,
					error: err
				});
			});
		});
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

	changPassword: (data) => (dispatch, getState) => {
		return new Promise(async resolve => {
			dispatch({
				type: USER_CHANGE_PASSWORD_TYPE, data: initialState
			});
			await post(USER_CHANGE_PASSWORD, data)
				.then(res => {
					if (res.status === SUCCESS_CODE) {
						dispatch({ type: USER_CHANGE_PASSWORD_SUCCESS, data: { changePass: res.data, isLoading: true, status: true, message: res.message } });
					} else {
						dispatch({ type: USER_CHANGE_PASSWORD_FAIL, data: { changePass: [], isLoading: true, status: false, message: res.message } });
					}
					resolve({
						status: true,
						data: res
					});
				})
				.catch(err => {
					dispatch({ type: USER_CHANGE_PASSWORD_FAIL, data: { changePass: [], isLoading: true, status: false, message: err.message } });
					resolve({
						status: false,
						error: err
					});
				})
		});
	},
};