// scripts/testAuth.js
// Simple Node script that registers a user (if not exists) then logs in and prints the token.
// Requires Node 18+ (global fetch available). Run: node scripts/testAuth.js

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

const testUser = {
  name: 'Thunder Test',
  email: process.env.TEST_EMAIL || 'test@example.com',
  password: process.env.TEST_PASSWORD || 'password123',
  role: 'Vendor',
  phone: '1234567890',
  address: '123 Test St'
};

async function register() {
  try {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const data = await res.json();
    console.log('Register status:', res.status);
    console.log('Register response:', data);
    return data;
  } catch (err) {
    console.error('Register error:', err);
    throw err;
  }
}

async function login() {
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });

    const data = await res.json();
    console.log('Login status:', res.status);
    console.log('Login response:', data);
    if (res.ok && data.token) {
      console.log('\n--- TOKEN ---\n' + data.token + '\n--- END TOKEN ---\n');
    }
    return data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

(async () => {
  console.log('Base URL:', baseUrl);
  try {
    await register();
  } catch (err) {
    // ignore register errors (e.g., user exists) and try login anyway
  }
  await login();
})();
