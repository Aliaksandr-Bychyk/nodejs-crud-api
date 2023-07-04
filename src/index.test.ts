import request from 'supertest';
import single from './single';
import Database from 'Database';
import { config } from 'dotenv';

config();

const port = process.env.PORT || '3000';
const host = `localhost:${port}`;

let server: () => void;
const database = new Database();
database.reset();

beforeAll(async () => {
  server = await single(port, database);
});

afterAll(() => {
  server();
});

describe('Scenario 1', () => {
  test('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const response = await request(host).get('/api/users');
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual([]);
  });
});

describe('Scenario 2', () => {
  test('Get the created record by its id - the created record is expected', async () => {
    const response = await request(host).post('/api/users/?username=Test&age=50&hobbies=[]');
    expect(response.statusCode).toBe(201);
    const id = response.text.slice(response.text.indexOf('id') + 5, response.text.length - 2);
    expect(database.getRecord(id)).toStrictEqual({ username: 'Test', age: 50, hobbies: [], id });
  });
});

describe('Scenario 3', () => {
  test('We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)', async () => {
    const response = await request(host).post('/api/users/?username=Test&age=50&hobbies=[]');
    expect(response.statusCode).toBe(201);
    const id = response.text.slice(response.text.indexOf('id') + 5, response.text.length - 2);
    expect(database.getRecord(id)).toStrictEqual({ username: 'Test', age: 50, hobbies: [], id });
    const newRecord = { username: 'Bob', age: 18, hobbies: [] };
    database.updateRecord(id, newRecord);
    expect(database.getRecord(id)).toStrictEqual({ id, ...newRecord });
  });
});
