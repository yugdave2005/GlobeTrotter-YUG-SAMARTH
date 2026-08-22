import otpGenerator from 'otp-generator';

/**
 * Generate a random OTP
 * @param {Number} length - Length of the OTP
 * @returns {String} Generated OTP
 */
export const generateOTP = (length = 6) => {
  return otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
};

/**
 * Verify an OTP
 * This is usually just a simple string comparison, but wrapped in a function for extensibility
 * @param {String} inputOtp - OTP provided by the user
 * @param {String} actualOtp - OTP stored in database or memory
 * @returns {Boolean} True if valid
 */
export const verifyOTP = (inputOtp, actualOtp) => {
  return inputOtp === actualOtp;
};
