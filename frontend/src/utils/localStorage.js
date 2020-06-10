const ACCESS_TOKEN_KEY = "voctail-access-token";
const REFRESH_TOKEN_KEY = "voctail-refresh-token";

export function setAccessToken(t) {
  localStorage.setItem(ACCESS_TOKEN_KEY, t);
}
export function setRefreshToken(t) {
  localStorage.setItem(REFRESH_TOKEN_KEY, t);
}
export function setTokens(at, rt) {
  localStorage.setItem(ACCESS_TOKEN_KEY, at);
  localStorage.setItem(REFRESH_TOKEN_KEY, rt);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function getTokens() {
  return [getAccessToken(), getRefreshToken()];
}

export function flushAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
export function flushRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
export function flushTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasTokens() {
  const [at, rt] = getTokens();
  if (at && rt) return true;
  else return false;
}

const USER_KEY = "voctail-current-user";
export function getUser() {
  const userString = localStorage.getItem(USER_KEY);
  return userString ? JSON.parse(userString) : {};
}
export function setUser(u) {
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}
export function flushUser() {
  localStorage.removeItem(USER_KEY);
}
export function hasUserChanged(newUserObj) {
  const newJson = JSON.stringify(newUserObj);
  return newJson !== localStorage.getItem(USER_KEY);
}
