const http = require('http');

const data = JSON.stringify({
  name: 'Test User API',
  email: 'testuser_api_' + Date.now() + '@test.com',
  phone: '123456789',
  service_type: 'citizenship',
  locale: 'en'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/client/clients',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response:');
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(data);
req.end();
