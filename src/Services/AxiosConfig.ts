import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_ECR_BASE_URL || "";
const axiosInstance: AxiosInstance = axios.create({ baseURL });

let refreshTimeout: ReturnType<typeof setTimeout>;

// type to represent decoded JWT token
type DecodedToken = {
  exp: number;
  [key: string]: any;
} | null;

// Decode JWT and extract expiration time
const decodeToken = (token: string): DecodedToken => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const DEFAULT_REFRESH_TIME_MS = 60000;

// Schedule token refresh before it expires
export const scheduleRefreshToken = async (token: string): Promise<void> => {
  clearTimeout(refreshTimeout);

  const decoded = decodeToken(token);
  if (!decoded?.exp) return;

  const expiresInMs = decoded.exp * 1000 - Date.now();
  const refreshTimeStr = import.meta.env.VITE_REFRESH_TIME || DEFAULT_REFRESH_TIME_MS.toString();
  const refreshTime = refreshTimeStr ? parseInt(refreshTimeStr) : DEFAULT_REFRESH_TIME_MS;

  const refreshInMs = expiresInMs - refreshTime;

  refreshTimeout = setTimeout(refreshAccessToken, Math.max(refreshInMs, 0));
};

// Refresh token function
export const refreshAccessToken = async (): Promise<string | undefined> => {
  const refreshToken = Cookies.get("refresh_token");
  if (!refreshToken) {
    handleSessionExpired();
    return;
  }

  try {
    const response = await axios.post(
      `${baseURL}/api/auth/refresh-token`,
      new URLSearchParams({ refresh_token: refreshToken }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, refresh_token: newRefreshToken } =
      response.data || {};
    if (!access_token || !newRefreshToken)
      throw new Error("Invalid refresh response");

    Cookies.set("jwt_token", access_token);
    Cookies.set("refresh_token", newRefreshToken);
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
  // Use replace to prevent back navigation and ensure clean logout
  window.location.replace("/logout");
};

// Axios Request Interceptor
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const isBypassAuth = import.meta.env.VITE_BYPASS_AUTH !== "false";
    if (isBypassAuth) return config;

    let token = Cookies.get("jwt_token");

    if (!token) {
      token = await refreshAccessToken();
      if (!token) throw new Error("Session expired, please log in again.");
    } else {
      const decoded = decodeToken(token);
      const exp = decoded?.exp;

      if (!exp || exp * 1000 < Date.now()) {
        console.log("⚠ Token expired, refreshing...");
        token = await refreshAccessToken();
        if (!token) throw new Error("Session expired, please log in again.");
      }
    }

    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error: any) => Promise.reject(error)
);

// Axios Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError & { config: any }) => {
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
export const handleLoginSuccess = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  Cookies.set("jwt_token", accessToken);
  Cookies.set("refresh_token", refreshToken);

  await scheduleRefreshToken(accessToken);
};

// Resume token refresh scheduling if token exists
(async () => {
  const existingToken = Cookies.get("jwt_token");
  if (existingToken) {
    await scheduleRefreshToken(existingToken);
  }
})();

export default axiosInstance;