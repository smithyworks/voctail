function validateEmail(email) {
  try {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  } catch {
    return false;
  }
}

const MIN_PASS_LENGTH = 8;

function validatePassword(pass) {
  try {
    return pass.length >= MIN_PASS_LENGTH;
  } catch {
    return false;
  }
}

module.exports = {
  MIN_PASS_LENGTH,
  validateEmail,
  validatePassword,
};
