const ACCESS_TOKEN_KEY = "voctail-access-token";
const REFRESH_TOKEN_KEY = "voctail-refresh-token";

export const setAccessToken = t => localStorage.setItem(ACCESS_TOKEN_KEY, t);
export const setRefreshToken = t => localStorage.setItem(REFRESH_TOKEN_KEY, t);
export const setTokens = (at, rt) => {
  setAccessToken(at);
  setRefreshToken(rt);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getTokens = () => [getAccessToken(), getRefreshToken()];

export const flushAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);
export const flushRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);
export const flushTokens = () => {
  flushAccessToken();
  flushRefreshToken();
};

export const hasTokens = () => {
  const [at, rt] = getTokens();
  if (at && rt) return true;
  else return false;
};
