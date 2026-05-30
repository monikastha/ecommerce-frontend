export const isBuyerLoggedIn = () =>
  localStorage.getItem("isLoggedIn") === "true" &&
  localStorage.getItem("role") === "buyer" &&
  !!localStorage.getItem("username");

