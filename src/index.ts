import { IRecord } from 'interfaces/IRecord.ts';
import http from 'node:http';
import Database from './Database.ts';
import path from 'node:path';
import url from 'node:url';

const database = new Database();

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  [
    { method: 'GET', handler: () => handleGet(req, res) },
    { method: 'POST', handler: () => handlePost(req, res) },
    { method: 'PUT', handler: () => handlePut(req, res) },
    { method: 'DELETE', handler: handlePost },
  ].forEach((request) => {
    if (request.method === req.method) request.handler(req, res);
  });
});

function handleGet(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
  const dirname = path.dirname(req.url as string);
  const basename = path.basename(req.url as string);

  if (dirname === '/api' && basename === 'users') {
    res.statusCode = 200;
    return res.end(JSON.stringify(database.getRecords()));
  }
  if (dirname === '/api/users') {
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
  }
}

function isUUID(uuid: string) {
  const sizeUUID = [8, 4, 4, 4, 12];
  const arrUUID = uuid.split('-');
  return (
    arrUUID.length === 5 && arrUUID.map((el, index) => sizeUUID[index] === el.length).reduce((acc, cur) => acc && cur)
  );
}

function handlePost(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
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

function getRecordObj(req: http.IncomingMessage): IRecord | null {
  const { query } = JSON.parse(JSON.stringify(url.parse(req.url as string, true)));
  if (['username', 'age', 'hobbies'].map((key) => query.hasOwnProperty(key)).reduce((acc, cur) => acc && cur)) {
    return {
      username: query.username,
      age: +query.age,
      hobbies: JSON.parse(query.hobbies),
    };
  } else {
    return null;
  }
}

function handlePut(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
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

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
