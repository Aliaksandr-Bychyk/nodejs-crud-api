import http from 'node:http';
import Database from '../Database.ts';
import path from 'node:path';
import url from 'node:url';
import getRecordObj from '../utils/getRecordObj.ts';
import isUUID from '../utils/isUUID.ts';

function handlePut(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, database: Database) {
  const dirname = path.dirname(req.url as string);
  const { pathname } = url.parse(req.url as string, true);
  const basename = path.basename(pathname as string);

  if (dirname === '/api/users') {
    if (isUUID(basename)) {
      const record = database.getRecord(basename);
      if (record) {
        const getRecord = getRecordObj(req);
        if (getRecord) {
          console.log(1);
          res.statusCode = 200;
          res.end('Record updated');
          database.updateRecord(record.id as string, getRecord);
        } else {
          res.statusCode = 400;
          res.end('Error: body does not contain required fields');
        }
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

export default handlePut;
