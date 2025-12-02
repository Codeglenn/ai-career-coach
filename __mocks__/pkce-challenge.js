// Minimal stub for pkce-challenge
function generateChallenge(_verifier) {
  return Promise.resolve('mock-challenge');
}

function pkceChallenge() {
  return Promise.resolve({ code_challenge: 'mock-challenge', code_verifier: 'mock-verifier' });
}

module.exports = { generateChallenge, pkceChallenge };
