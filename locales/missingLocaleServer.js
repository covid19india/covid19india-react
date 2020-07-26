const fs = require('fs');
const http = require('http');

const hostname = '127.0.0.1';
const port = '9999';

const server = http.createServer(async (req, res) => {
  let body = [];
  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      fs.openSync('locales/missing_locales.json', 'a');
      const data = fs.readFileSync('locales/missing_locales.json', 'utf-8');

      const dataToWrite = JSON.stringify(
        {
          ...JSON.parse(data || '{}'),
          ...JSON.parse(body || '{}'),
        },
        null,
        2
      );

      fs.writeFileSync('locales/missing_locales.json', dataToWrite);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET',
        'Access-Control-Allow-Headers': '*',
      });
      res.end(body);
    });
});

server.listen(port, hostname);
