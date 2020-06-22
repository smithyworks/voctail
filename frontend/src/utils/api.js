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

export function deleteUser(user_id) {
  return axios.post(`${base}/admin/delete-user`, { user_id });
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

//documents

export function fetchDocuments() {
  return axios.get(`${base}/documents`);
}

/* add and delete documents (WIP)
export function addDocument(document_id) {
  return axios.post(`${base}/documents/add-document`, { document_id, title, description, content, image });
}

export function deleteDocument(document_id) {
  return axios.post(`${base}/documents/delete-document`, { document_id });
}

 */
