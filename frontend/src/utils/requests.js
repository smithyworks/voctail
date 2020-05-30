import axios from "axios";

const base = process.env.REACT_APP_API_URL;

export function login(email, password) {
  return axios.post(`${base}/login`, { email, password });
}

export function register(name, email, password) {
  return axios.post(`${base}/register`, { name, email, password });
}

export function logout() {
  return axios.get(`${base}/logout`);
}
