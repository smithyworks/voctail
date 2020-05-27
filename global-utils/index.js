function validateEmail(email) {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}

function validatePassword(pass) {
  return pass.length > 7;
}

module.exports = {
  validateEmail,
  validatePassword,
};
