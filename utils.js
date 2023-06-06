const http = require('https');

exports.fetch = (url, method = 'GET', body = '') => new Promise((resolve, reject) => {
  console.log('fetch url:', url);
  let headers = {};
  if (typeof body === typeof {}) {
    body = JSON.stringify(body);
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    };
  }

  const req = http.request(url, { method, headers }, (res) => {
    const { statusCode } = res;
    // const contentType = res.headers['content-type'];

    console.log('statusCode:', statusCode);
    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
    }

    if (error) {
      console.error(error.message);
      // Consume response data to free up memory
      res.resume();
      reject(error);
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        resolve(parsedData);
      } catch (e) {
        console.error(e.message);
        reject(e);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    reject(e);
  });
  req.write(body);
  req.end();
});
