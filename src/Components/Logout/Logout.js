import Cookies from 'js-cookie'
export const performLogout = () => {
  localStorage.clear();  // Clear local storage, session storage & cookies
  sessionStorage.clear();
  Cookies.remove("jwt_token")
  Cookies.remove("refresh_token")
};

const Logout = () => {
  performLogout(); // Call logout explicitly only when Logout component is visited
  localStorage.setItem("logoutSuccess", "true");
  window.location.replace("/login"); // Prevents back navigation
  return null;
};

export default Logout;
