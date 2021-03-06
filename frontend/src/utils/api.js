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

export function getAllUsers() {
  return axios.get(`${base}/users-all`);
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

export function contributedTranslations() {
  return axios.post(`${base}/admin/contributed-translations`);
}

export function updateTranslation(translation_id, approved) {
  return axios.post(`${base}/admin/update-translation`, { translation_id, approved });
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
export function fetchQuizzesByCategory() {
  return axios.get(`${base}/quiz-category`);
}
export function fetchQuizMetrics(quiz_id) {
  return axios.get(`${base}/quiz-metrics`, { params: { quiz_id: quiz_id } });
}
export function fetchQuizzesMetrics(user_id) {
  return axios.get(`${base}/quizzes-metrics`, { params: { user_id: user_id } });
}
export function deleteQuiz(quiz_id) {
  return axios.post(`${base}/delete-quiz`, { quiz_id });
}
export function createQuiz(title, length) {
  return axios.post(`${base}/create-quiz`, { title, length });
}
export function renameQuiz(quiz_id, title) {
  return axios.post(`${base}/rename-quiz`, { quiz_id, title });
}

export function viewedNowQuiz(quiz_id) {
  return axios.post(`${base}/viewed-now-quiz`, { quiz_id });
}
export function updateMetricsQuiz(quiz_id, results) {
  return axios.post(`${base}/update-metrics-quiz`, { quiz_id, results });
}
export function createQuizFromDoc(document_id, length) {
  //"document_id":document_id, "length":length
  return axios.post(`${base}/create-document-quiz`, { document_id, length });
}
export function createQuizFromDocFixedLength(document_id) {
  //"document_id":document_id, "length":length
  return axios.post(`${base}/create-document-quiz`, { document_id, length: 5 });
}
export function createCustomQuiz(title, questions) {
  return axios.post(`${base}/create-custom-quiz`, { title, questions });
}

//documents

export function fetchDocuments() {
  return axios.get(`${base}/handle-documents`);
}
export function addDocument(publisher, title, author, category, isPublic, blocks) {
  return axios.post(`${base}/add-document`, {
    publisher,
    title,
    author,
    category,
    isPublic,
    blocks,
  });
}
export function deleteDocument(document_id) {
  return axios.post(`${base}/delete-document`, { document_id });
}
export function editDocument(document_id, title, author, category, isPublic) {
  return axios.post(`${base}/edit-document`, { document_id, title, author, category, isPublic });
}

export function viewedDocumentNow(document_id) {
  return axios.post(`${base}/viewed-document-now`, { document_id });
}

export function getDocumentMetrics(user_id) {
  return axios.get(`${base}/get-document-metrics`, { params: { user: user_id } });
}

export function calcDocumentFit(document_id) {
  return axios.get(`${base}/calc-document-fit`, { params: { document_id: document_id } });
}

// vocabulary

export function updateVocabulary(entries) {
  return axios.post(`${base}/update-vocabulary`, { entries });
}

export function addTranslation(word_id, translation) {
  return axios.post(`${base}/add-translation`, { word_id, translation });
}

//classrooms

export function fetchClassrooms() {
  return axios.get(`${base}/classrooms`);
}
export function fetchClassroom(classroom_id) {
  return axios.post(`${base}/classroom`, { classroom_id });
}
export function addStudentsToClassroom(classroom_id, student_ids) {
  return axios.post(`${base}/add-classroom-members`, { classroom_id, student_ids });
}
export function addTeachersToClassroom(classroom_id, teacher_ids) {
  return axios.post(`${base}/add-classroom-members`, { classroom_id, teacher_ids });
}
export function removeClassroomMember(classroom_id, member_id) {
  return axios.post(`${base}/remove-classroom-member`, { classroom_id, member_id });
}
export function addChapterToClassroom(classroom_id, name) {
  return axios.post(`${base}/add-classroom-chapter`, { classroom_id, name });
}
export function removeDocumentFromClassroom(classroom_id, document_id) {
  return axios.post(`${base}/remove-classroom-document`, { classroom_id, document_id });
}
export function removeChapterFromClassoom(classroom_id, name) {
  return axios.post(`${base}/delete-classroom-chapter`, { classroom_id, name });
}
export function renameChapterFromClassoom(classroom_id, name, newName) {
  return axios.post(`${base}/rename-classroom-chapter`, { classroom_id, name, newName });
}
export function addDocumentsToClassroom(classroom_id, section, document_ids) {
  return axios.post(`${base}/add-classroom-documents`, { classroom_id, section, document_ids });
}

// old
export function fetchClassroomsAsStudent(member_id) {
  return axios.get(`${base}/classrooms-as-student`, { params: { member_id: member_id } });
}

export function fetchClassroomsAsTeacher(member_id) {
  return axios.get(`${base}/classrooms-as-teacher`, { params: { member_id: member_id } });
}

export function getClassroom(classroom_id) {
  return axios.get(`${base}/classroom`, { params: { classroom_id: classroom_id } });
}
export function isTeacher(classroom_id, member_id) {
  return axios.get(`${base}/classroom-is-teacher`, { params: { classroom_id: classroom_id, member_id: member_id } });
}

export function getStudents(classroom_id) {
  return axios.get(`${base}/classrooms-students`, { params: { classroom_id: classroom_id } });
}

export function getOwner(classroom_id) {
  return axios.get(`${base}/classrooms-owner`, { params: { classroom_id: classroom_id } });
}

export function getTeachers(classroom_id) {
  return axios.get(`${base}/classrooms-teachers`, { params: { classroom_id: classroom_id } });
}

export function getDocuments(classroom_id, document_id) {
  return axios.get(`${base}/classrooms-documents`, {
    params: { classroom_id: classroom_id, document_id: document_id },
  });
}

export function getSections(classroom_id) {
  return axios.get(`${base}/classrooms-sections`, { params: { classroom_id: classroom_id } });
}

export function createClassroom(title, topic, description) {
  return axios.post(`${base}/create-classroom`, { title, topic, description });
}

export function deleteClassroom(classroom_id) {
  return axios.post(`${base}/delete-classroom`, { classroom_id });
}

export function deleteSection(classroom_id, section) {
  return axios.post(`${base}/delete-section`, { classroom_id, section });
}

export function renameClassroom(classroom_id, new_title) {
  return axios.post(`${base}/rename-classroom`, { classroom_id, new_title });
}

export function renameSection(classroom_id, section, new_title) {
  return axios.post(`${base}/rename-section`, { classroom_id, section, new_title });
}

export function addMembersToClassroom(classroom_id, member_ids, is_teacher) {
  return axios.post(`${base}/add-members-to-classroom`, { classroom_id, member_ids, is_teacher });
}

export function deleteMemberFromClassroom(classroom_id, member_id) {
  return axios.post(`${base}/delete-member-from-classroom`, { classroom_id, member_id });
}

export function addDocumentToClassroom(classroom_id, document_id, section) {
  return axios.post(`${base}/add-document-to-classroom`, { classroom_id, document_id, section });
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
export function uploadProfilePicture(files) {
  const formData = new FormData();
  formData.append("profile_pic", files[0]);
  return axios.post(`${base}/upload-profile-picture`, formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
}
export function deleteProfilePicture() {
  return axios.delete(`${base}/delete-profile-picture`);
}

export function getUser(user_id) {
  return axios.get(`${base}/get-user`, { params: { id: user_id } });
}

// breadcrumbs

export function breadcrumbs({ document_id, quiz_id, classroom_id }) {
  return axios.post(`${base}/breadcrumbs`, { document_id, quiz_id, classroom_id });
}

export function documentTitle(document_id) {
  return axios.get(`${base}/document-title`, { params: { document_id } });
}

export function quizTitle(quiz_id) {
  return axios.get(`${base}/quiz-title`, { params: { quiz_id } });
}
