import http from 'node:http';
import Database from '../Database.ts';
import path from 'node:path';
import isUUID from '../utils/isUUID.ts';

function handleDelete(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, database: Database) {
  const dirname = path.dirname(req.url as string);
  const basename = path.basename(req.url as string);

  if (dirname === '/api/users') {
    if (isUUID(basename)) {
      const record = database.getRecord(basename);
      if (record) {
        res.statusCode = 204;
        res.end('Record removed');
        database.deleteRecord(basename);
      } else {
        res.statusCode = 404;
        res.end("Error: userId doesn't exist");
      }
    } else {
      res.statusCode = 400;
      res.end('Error: userId is invalid (not uuid)');
    }
  }
}

export default handleDelete;
