import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a given user payload
 * @param {Object} payload - Data to be encrypted in the token (e.g., { id: user._id })
 * @param {String} expiresIn - Expiration time (e.g., '1d', '30d')
 * @returns {String} JWT token
 */
export const generateToken = (payload, expiresIn = '30d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Verify a JWT token
 * @param {String} token - The JWT token to verify
 * @returns {Object} Decoded payload if successful
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
