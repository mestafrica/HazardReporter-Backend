const http = require('http');

function makeRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 1337,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: rawData }));
    });
    req.on('error', e => reject(e));
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const regRes = await makeRequest('/api/users/register', {
      firstName: "Test",
      lastName: "User",
      userName: "testuser001",
      email: "test001@example.com",
      password: "Password123",
      confirmPassword: "Password123"
    });
    console.log('Register:', regRes.status, regRes.body);

    const logRes = await makeRequest('/api/users/login', {
      userName: "testuser001",
      password: "Password123"
    });
    console.log('Login:', logRes.status, logRes.body);
  } catch(e) {
    console.error('Request failed:', e.message);
  }
})();
