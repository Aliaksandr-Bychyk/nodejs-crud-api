import { IRecord } from '../interfaces/IRecord';
import http from 'node:http';
import url from 'node:url';

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

export default getRecordObj;
