import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google OAuth ID token sent from the client
 * @param {String} idToken - The ID token from Google
 * @returns {Object} Payload containing user info (email, name, picture, etc.)
 */
export const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    return payload; // Contains payload.email, payload.name, payload.sub (Google ID), etc.
  } catch (error) {
    throw new Error('Invalid Google Token');
  }
};
