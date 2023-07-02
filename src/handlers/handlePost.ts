import http from 'node:http';
import Database from '../Database.ts';
import path from 'node:path';
import getRecordObj from '../utils/getRecordObj.ts';

function handlePost(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, database: Database) {
  const dirname = path.dirname(req.url as string);

  if (dirname === '/api/users') {
    const record = getRecordObj(req);
    if (record) {
      res.statusCode = 201;
      database.createRecord(record);
      res.end('New record created: ' + JSON.stringify(record));
    } else {
      res.statusCode = 400;
      res.end('Error: body does not contain required fields');
    }
  }
}

export default handlePost;
