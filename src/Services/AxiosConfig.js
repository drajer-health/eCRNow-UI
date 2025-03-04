import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.REACT_APP_ECR_BASE_URL || "http://localhost:8081";

const axiosInstance = axios.create({
  baseURL,          
});

// Request interceptor to attach JWT token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for refreshing token if expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the error status is 401 and we haven't retried yet:
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Get refresh token from cookie
        const refreshToken = Cookies.get("refresh_token");
        // Send the refresh token as URL-encoded form data:
        const refreshResponse = await axiosInstance.post(
          "/api/auth/refresh-token",
          new URLSearchParams({ refresh_token: refreshToken }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        if (
          refreshResponse.data &&
          refreshResponse.data.access_token
        ) {
          // Update cookies with new tokens
          Cookies.set("jwt_token", refreshResponse.data.access_token, {
            expires: 1,
          });
          if (refreshResponse.data.refresh_token) {
            Cookies.set(
              "refresh_token",
              refreshResponse.data.refresh_token,
              { expires: 30 / 1440 } // 30 minutes in days
            );
          }
          // Update the original request's Authorization header
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, optionally logout the user or handle error
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

