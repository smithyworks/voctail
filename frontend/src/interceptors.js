import axios from "axios";
import { tokens } from "./utils";

export default () => {
  // Intercept requests and attach access token.
  axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${tokens.getAccessToken()}`;
    return config;
  });

  // Intercept response and refresh token if appropriate.
  axios.interceptors.response.use(
    response => response,
    error => {
      // Return any error which is not due to authentication back to the calling service
      if (error.response.status !== 401) return new Promise((resolve, reject) => reject(error));

      // Logout user if token refresh didn't work or user is disabled
      if (error.config.url === `${process.env.API_URL}/token`) {
        tokens.flushTokens();

        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      // Try request again with new token
      axios
        .post(`${process.env.API_URL}/token`, { refreshToken: tokens.getRefreshToken() })
        .then(res => {
          const token = res.data.accessToken;
          tokens.setAccessToken(token);

          // New request with new token
          const config = error.config;
          config.headers["Authorization"] = `Bearer ${token}`;

          return new Promise((resolve, reject) => {
            axios
              .request(config)
              .then(response => {
                resolve(response);
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(error => {
          Promise.reject(error);
        });
    }
  );
};
