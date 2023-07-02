import http from 'node:http';
import Database from './Database.ts';
import path from 'node:path';

const database = new Database();

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  [
    { method: 'GET', handler: () => handleGet(req, res) },
    { method: 'POST', handler: () => handlePost(req, res) },
    { method: 'PUT', handler: handlePost },
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
      if (record.length === 1) {
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
  const basename = path.basename(req.url as string);
  if (dirname === '/api/users') {
    const record = getRecordObj(basename);
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

function getRecordObj(str: string) {
  if (['username', 'age', 'hobbies'].map((key) => str.includes(key)).reduce((acc, cur) => acc && cur)) {
    return {
      username: str.slice(10, str.indexOf('&age')),
      age: +str.slice(str.indexOf('&age=') + 5, str.indexOf('&hobbies')),
      hobbies: str
        .slice(str.indexOf('[') + 1, str.indexOf(']'))
        .replaceAll('%22', '')
        .replaceAll('%20', '')
        .split(','),
    };
  } else {
    return null;
  }
}

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
