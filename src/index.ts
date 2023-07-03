import { config } from 'dotenv';
import Database from './Database';
import single from './single';
import multi from './multi';

config();

const database = new Database();
const port = process.env.PORT || '3000';
if (process.argv[2]) {
  multi(port, database);
} else {
  single(port, database);
}
