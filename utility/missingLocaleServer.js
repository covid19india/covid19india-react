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
      fs.openSync('all_locales.json', 'a');
      const enJson = fs.readFileSync('public/locales/en.json', 'utf-8');
      const data = fs.readFileSync('all_locales.json', 'utf-8');
      console.log(`body is: ${body}`);

      const dataToWrite = JSON.stringify(
        {
          ...JSON.parse(enJson || '{}'),
          ...JSON.parse(data || '{}'),
          ...JSON.parse(body || '{}'),
        },
        null,
        2
      );

      fs.writeFileSync('all_locales.json', dataToWrite);

      console.log(`${body} added to the file!`);
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
