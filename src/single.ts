import http from 'node:http';
import Database from './Database';
import handleGet from './handlers/handleGet';
import handlePut from './handlers/handlePut';
import handlePost from './handlers/handlePost';
import handleDelete from './handlers/handleDelete';

const single = async (port: string, database: Database) => {
  const server = http.createServer((req, res) => {
    try {
      [
        { method: 'GET', handler: () => handleGet(req, res, database) },
        { method: 'POST', handler: () => handlePost(req, res, database) },
        { method: 'PUT', handler: () => handlePut(req, res, database) },
        { method: 'DELETE', handler: () => handleDelete(req, res, database) },
      ].forEach((request) => {
        if (request.method === req.method) request.handler();
      });
    } catch (error) {
      res.statusCode = 500;
      res.end(`ERROR: ${(error as Error).message}`);
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
  return () => server.close();
};

export default single;
