import http from 'node:http';
import Database from './Database.ts';
import handleGet from './handlers/handleGet.ts';
import handlePut from './handlers/handlePut.ts';
import handlePost from './handlers/handlePost.ts';
import handleDelete from './handlers/handleDelete.ts';

const database = new Database();

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  [
    { method: 'GET', handler: () => handleGet(req, res, database) },
    { method: 'POST', handler: () => handlePost(req, res, database) },
    { method: 'PUT', handler: () => handlePut(req, res, database) },
    { method: 'DELETE', handler: () => handleDelete(req, res, database) },
  ].forEach((request) => {
    if (request.method === req.method) request.handler();
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
