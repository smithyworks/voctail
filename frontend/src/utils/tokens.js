const ACCESS_TOKEN_KEY = "voctail-access-token";
const REFRESH_TOKEN_KEY = "voctail-refresh-token";

const onChangeCallbacks = [];
function signalChange() {
  onChangeCallbacks.forEach((cb) => {
    if (typeof cb === "function") cb(hasTokens());
  });
}

export function setAccessToken(t) {
  localStorage.setItem(ACCESS_TOKEN_KEY, t);
  signalChange();
}
export function setRefreshToken(t) {
  localStorage.setItem(REFRESH_TOKEN_KEY, t);
  signalChange();
}
export function setTokens(at, rt) {
  localStorage.setItem(ACCESS_TOKEN_KEY, at);
  localStorage.setItem(REFRESH_TOKEN_KEY, rt);
  signalChange();
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
  signalChange();
}
export function flushRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  signalChange();
}
export function flushTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  signalChange();
}

export function hasTokens() {
  const [at, rt] = getTokens();
  if (at && rt) return true;
  else return false;
}

export function onChange(cb) {
  onChangeCallbacks.push(cb);
}
