import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.REACT_APP_ECR_BASE_URL;
const axiosInstance = axios.create({ baseURL });

let refreshTimeout;

// Decode JWT and extract expiration time
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Schedule token refresh before it expires
export const scheduleRefreshToken = async (token) => {
  clearTimeout(refreshTimeout);

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return;

  let expiresInMs = decoded.exp * 1000 - Date.now();
  let refreshInMs = expiresInMs - (parseInt(process.env.REACT_APP_REFRESH_TIME, 10) || 60000); 
  refreshTimeout = setTimeout(refreshAccessToken, Math.max(refreshInMs, 0));
};

// Refresh token function
export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get("refresh_token");
  if (!refreshToken) return handleSessionExpired();

  try {
    console.log("🔄 Refreshing token...");
    const response = await axios.post(
      `${baseURL}/api/auth/refresh-token`,
      new URLSearchParams({ refresh_token: refreshToken }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token } = response.data || {};
    if (!access_token || !refresh_token) throw new Error("Invalid refresh response");

    Cookies.set("jwt_token", access_token,);
    Cookies.set("refresh_token", refresh_token,);
    await scheduleRefreshToken(access_token);

    return access_token;
  } catch (error) {
    handleSessionExpired();
  }
};

// Handle session expiration
const handleSessionExpired = () => {
  console.warn("⚠ Session expired. Logging out...");
  Cookies.remove("jwt_token");
  Cookies.remove("refresh_token");
  localStorage.setItem("logoutSuccess", "sessionExpired");
  window.location.href = "/logout";
};

// Axios Request Interceptor

axiosInstance.interceptors.request.use(async (config) => {
  const isBypassAuth = process.env.REACT_APP_BYPASS_AUTH !== 'false'

  if (isBypassAuth) {
    return config; // Allow API call without token
  }

  let token = Cookies.get("jwt_token");

  if (!token || decodeToken(token)?.exp * 1000 < Date.now()) {
    console.log("⚠ Token expired, refreshing...");
    token = await refreshAccessToken();
    if (!token) throw new Error("Session expired, please log in again.");
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Axios Response Interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(error.config);
      }
    }
    return Promise.reject(error);
  }
);

// Handle login success and start token refresh cycle
export const handleLoginSuccess = async (accessToken, refreshToken) => {
  Cookies.set("jwt_token", accessToken);
  Cookies.set("refresh_token", refreshToken);

  await scheduleRefreshToken(accessToken);
};

// Resume token refresh scheduling if a token exists
(async () => {
  const existingToken = Cookies.get("jwt_token");
  if (existingToken) {
    await scheduleRefreshToken(existingToken);
  }
})();

export default axiosInstance;