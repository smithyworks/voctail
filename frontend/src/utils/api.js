import axios from "axios";

const base = "/api";

export function login(email, password, rememberMe) {
  return axios.post(`${base}/login`, { email, password, rememberMe });
}

export function register(name, email, password) {
  return axios.post(`${base}/register`, { name, email, password });
}

export function logout() {
  return axios.get(`${base}/logout`);
}

export function user() {
  return axios.get(`${base}/user`);
}

export function document() {
  return axios.get(`${base}/document`);
}

// Admin endpoints

export function users() {
  return axios.get(`${base}/admin/users`);
}

export function revokeToken(user_id) {
  return axios.post(`${base}/admin/revoke-token`, { user_id });
}

export function masquerade(user_id) {
  return axios.post(`${base}/admin/masquerade`, { user_id });
}

export function endMasquerade(user_id) {
  return axios.get(`${base}/admin/end-masquerade`);
}
