import Cookies from 'js-cookie'

const Logout = () => {
  Cookies.remove("jwt_token")
  Cookies.remove("refresh_token")
  localStorage.setItem("logoutSuccess", "true");
  window.location.replace("/login"); // Prevents back navigation

  return null;
};

export default Logout;
