import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/upload/images',
  method: 'GET'
};

console.log('Testing upload endpoint availability...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 405) {
      console.log('✅ Upload endpoint exists (Method not allowed for GET is expected)');
    } else if (res.statusCode === 404) {
      console.log('❌ Upload endpoint not found');
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`❌ Request failed: ${e.message}`);
  process.exit(1);
});

req.end();
