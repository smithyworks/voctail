export function validateEmail(email) {
  try {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  } catch {
    return false;
  }
}

export const MIN_PASS_LENGTH = 8;

export function validatePassword(pass) {
  try {
    return pass.length >= MIN_PASS_LENGTH;
  } catch {
    return false;
  }
}
