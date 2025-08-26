const http = require('http');

// Test the health endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
};

console.log('Testing API health endpoint...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    
    // Test events endpoint
    console.log('\nTesting events endpoint...');
    testEvents();
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();

function testEvents() {
  const eventsOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/events',
    method: 'GET'
  };

  const eventsReq = http.request(eventsOptions, (res) => {
    console.log(`Events Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const events = JSON.parse(data);
        console.log(`Found ${events.data ? events.data.length : 0} events`);
        console.log('API test completed successfully!');
      } catch (e) {
        console.log('Events response:', data);
      }
      process.exit(0);
    });
  });

  eventsReq.on('error', (e) => {
    console.error(`Problem with events request: ${e.message}`);
    process.exit(1);
  });

  eventsReq.end();
}
