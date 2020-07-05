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

export function user(user_id) {
  return axios.post(`${base}/user`, { user_id });
}

export function document(document_id) {
  return axios.post(`${base}/document`, { document_id });
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

//quizzes

export function fetchQuizzes() {
  return axios.get(`${base}/quizzes`);
}
export function fetchQuiz(quiz_id) {
  return axios.get(`${base}/quiz`, { params: { quiz_id: quiz_id } });
}
export function fetchQuizByDocument(document_id) {
  return axios.get(`${base}/quiz-by-document`, { params: { document_id: document_id } });
}
export function deleteQuiz(quiz_id) {
  return axios.post(`${base}/delete-quiz`, { quiz_id });
}
export function createQuiz(title, length) {
  return axios.post(`${base}/create-quiz`, { title, length });
}
export function createQuizFromDoc(document_id, length) {
  //"document_id":document_id, "length":length
  return axios.post(`${base}/create-document-quiz`, { document_id, length });
}
export function createCustomQuiz(title, questions) {
  return axios.post(`${base}/create-custom-quiz`, { title, questions });
}

//documents

export function fetchDocuments() {
  return axios.get(`${base}/handle-documents`);
}

// add and delete documents (WIP)
export function addDocument(title, description, isPublic, content, author) {
  return axios.post(`${base}/add-document`, { title, description, isPublic, content, author });
}
//WIP
export function deleteDocument(document_id) {
  return axios.post(`${base}/delete-document`, { document_id });
}

// vocabulary

export function updateVocabulary(entries) {
  return axios.post(`${base}/update-vocabulary`, { entries });
}

export function addTranslation(word_id, translation) {
  return axios.post(`${base}/add-translation`, { word_id, translation });
}

//classrooms

export function getClassrooms() {
  return axios.get(`${base}/classrooms`);
}

export function createClassroom(title, topic, description, open) {
  return axios.post(`${base}/create-classroom`, { title, topic, description, open });
}

export function addStudentToClassroom(student_id) {
  return axios.post(`${base}/add-student-to-classroom`, { student_id });
}

export function addDocumentToClassroom(document_id) {
  return axios.post(`${base}/add-document-to-classroom`, { document_id });
}

// user

export function setPremium(premium) {
  return axios.post(`${base}/set-premium`, { premium: !!premium });
}
export function setName(name) {
  return axios.post(`${base}/set-name`, { name });
}
export function setEmail(email) {
  return axios.post(`${base}/set-email`, { email });
}
export function setPassword(password) {
  return axios.post(`${base}/set-password`, { password });
}
export function vocabulary(user_id) {
  return axios.post(`${base}/user-vocabulary`, { user_id });
}
