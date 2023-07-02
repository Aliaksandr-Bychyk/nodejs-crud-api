import http from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    res.end(`{"error": "${http.STATUS_CODES[405]}"}`);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    if (req.url === '/') {
      res.end(`<h1>Hello World</h1>`);
    }
    if (req.url === '/hello') {
      res.end(`<h1>Hello</h1>`);
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
