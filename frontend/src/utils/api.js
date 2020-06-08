import axios from "axios";

const base = process.env.REACT_APP_API_URL ?? "" + "/api";

export function login(email, password) {
  return axios.post(`${base}/login`, { email, password });
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

export function users() {
  return axios.get(`${base}/admin/users`);
}
