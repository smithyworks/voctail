import axios from "axios";
import { localStorage } from ".";

export function setRequestInterceptor() {
  // Intercept requests and attach access token.
  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getAccessToken()}`;
    return config;
  });
}

export function setResponseInterceptor() {
  // Intercept response and refresh token if appropriate.
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Return any error which is not due to authentication back to the calling service
      if (error.response.status !== 401) return new Promise((_, reject) => reject(error));

      const originalConfig = error.config;
      // Logout user if token refresh didn't work or user is disabled
      if (originalConfig.url === `${process.env.API_URL ?? ""}/api/token`) {
        localStorage.flushTokens();
        window.location.href = "/";
        return new Promise((_, reject) => reject(error));
      }

      // Try request again with new token
      return axios
        .post(`${process.env.API_URL ?? ""}/api/token`, { refreshToken: localStorage.getRefreshToken() })
        .then((res) => {
          if (res.status === 201) {
            const { accessToken } = res.data;
            localStorage.setAccessToken(accessToken);

            return axios.request(originalConfig);
          }
        });
    }
  );
}
