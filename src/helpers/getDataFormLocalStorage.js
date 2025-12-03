const getDataFormLocalStorage = {
  getAccountId: () => {
    try {
      const accountId = localStorage.getItem("ACCOUNT_ID");
      return accountId ? accountId : null;
    } catch (error) {
      console.error("Lỗi khi lấy ACCOUNT_ID từ localStorage:", error);
      return null;
    }
  },
};

export default getDataFormLocalStorage;
