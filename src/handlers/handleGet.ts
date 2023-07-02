import http from 'node:http';
import Database from '../Database';
import path from 'node:path';
import isUUID from '../utils/isUUID';

function handleGet(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, database: Database) {
  const dirname = path.dirname(req.url as string);
  const basename = path.basename(req.url as string);

  if (dirname === '/api' && basename === 'users') {
    res.statusCode = 200;
    res.end(JSON.stringify(database.getRecords()));
  } else if (dirname === '/api/users') {
    if (isUUID(basename)) {
      const record = database.getRecord(basename);
      if (record) {
        res.statusCode = 200;
        res.end(JSON.stringify(record));
      } else {
        res.statusCode = 404;
        res.end("Error: userId doesn't exist");
      }
    } else {
      res.statusCode = 400;
      res.end('Error: userId is invalid (not uuid)');
    }
  } else {
    res.statusCode = 404;
    res.end('ERROR: Requests to non-existing endpoints');
  }
}

export default handleGet;
