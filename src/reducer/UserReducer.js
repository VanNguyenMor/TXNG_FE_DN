import {
	GET_USER_LIST_SUCCESS_TYPE,
	GET_USER_LIST_FAIL_TYPE,
	GET_USER_INFO_SUCCESS_TYPE,
	GET_USER_INFO_FAIL_TYPE,
	UPDATE_USER_INFO_SUCCESS_TYPE,
	UPDATE_USER_INFO_FAIL_TYPE,
	CREATE_USER_INFO_SUCCESS_TYPE,
	CREATE_USER_INFO_FAIL_TYPE,
	DELETE_USER_INFO_SUCCESS_TYPE,
	DELETE_USER_INFO_FAIL_TYPE,
	USER_UPDATE_ME_SUCCESS,
	USER_UPDATE_ME_FAIL,
	USER_CHANGE_PASSWORD_SUCCESS,
	USER_CHANGE_PASSWORD_FAIL
} from "../services/Common";

const initialState = { data: [], isLoading: false, status: null, message: '' };

export const userReducer = (state, action) => {
	state = state || initialState;

	if (action.type === GET_USER_LIST_SUCCESS_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === GET_USER_LIST_FAIL_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === GET_USER_INFO_SUCCESS_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === GET_USER_INFO_FAIL_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === UPDATE_USER_INFO_SUCCESS_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === UPDATE_USER_INFO_FAIL_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === CREATE_USER_INFO_SUCCESS_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === CREATE_USER_INFO_FAIL_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === DELETE_USER_INFO_FAIL_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === CREATE_USER_INFO_FAIL_TYPE) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === USER_UPDATE_ME_SUCCESS) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === USER_UPDATE_ME_FAIL) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === USER_CHANGE_PASSWORD_SUCCESS) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	if (action.type === USER_CHANGE_PASSWORD_FAIL) {
		return {
			data: action.data,
			isLoading: action.isLoading,
			status: action.status,
			message: action.message,
		};
	}

	return state;
};