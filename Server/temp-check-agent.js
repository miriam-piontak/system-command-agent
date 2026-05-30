const http = require('http');
const tests = [
  { name: 'supported', text: 'הפעל את המחשבון בבקשה' },
  { name: 'unsupported', text: 'הפעל את פוטושופ' },
  { name: 'irrelevant', text: 'ספר בדיחה על חתולים' }
];

function post(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ text });
    const req = http.request({
      hostname: '127.0.0.1',
      port: 4003,
      path: '/api/agent',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const test of tests) {
    try {
      const result = await post(test.text);
      console.log('---', test.name, '---');
      console.log('status:', result.status);
      console.log('body:', result.body);
    } catch (err) {
      console.error('ERROR', test.name, err.message);
    }
  }
})();
