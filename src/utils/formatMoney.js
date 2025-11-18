export const formatMoney = (str) => {
  if (!str) return "";
  const numStr = str.toString().replace(/\D/g, "");
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseMoney = (str) => {
  if (!str) return 0;
  return Number(str.toString().replace(/\./g, ""));
};
