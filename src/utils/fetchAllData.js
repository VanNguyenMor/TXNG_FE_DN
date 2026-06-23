import { postFormData, putFormData, post, del, put, get } from "services/Dataservice";

export const callApi = async (
  method,
  endpoint,
  payload = {},
  isFormData = false
) => {
  const API_DOMAIN ="http://localhost:8088/api/";
  //const API_DOMAIN ="https://truyxuatnguongoc.tiengiang.gov.vn:9803/api/";
  //const API_DOMAIN = "https://localhost:44310/api/";
  const url = API_DOMAIN + endpoint;

  switch (method.toLowerCase()) {
    case "get":
      return await get(url, payload);
    case "post":
      return await (isFormData
        ? postFormData(url, payload)
        : post(url, payload));
    case "put":
      return await (isFormData ? putFormData(url, payload) : put(url, payload));
    case "delete":
      return await del(url);
    default:
      throw new Error("Invalid method");
  }
};
