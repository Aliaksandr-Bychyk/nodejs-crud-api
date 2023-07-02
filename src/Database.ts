import crypto from 'crypto';

interface IRecords {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export default class Database {
  private records: IRecords[] = [
    { id: '3e7253ef-ba3c-4cf5-a160-9cf2392692ab', username: 'first1', age: 16, hobbies: ['dancing'] },
    { id: '2bd8b494-899e-496a-aa94-1ca20d013633', username: 'first2', age: 18, hobbies: [] },
    { id: '5919d042-abb2-4749-b000-327cb5605f76', username: 'first3', age: 20, hobbies: ['playing, skating'] },
    { id: '1978708c-8def-4e35-a640-3e1808d2faa1', username: 'first4', age: 22, hobbies: [] },
  ];

  getRecords() {
    return this.records;
  }

  getRecord(id: string) {
    return this.records.filter((record) => record.id === id);
  }

  createRecord(record: IRecords) {
    record['id'] = this.checkUUID();
    this.records.push(record);
  }

  updateRecord(id: string, record: IRecords) {
    const updatedRecords = [...this.records];
    const index = updatedRecords.findIndex((record) => record.id === id);
    updatedRecords[index] = record;
    this.records = updatedRecords;
  }

  deleteRecord(id: string) {
    const updatedRecords = [...this.records];
    this.records = updatedRecords.filter((record) => record.id !== id);
  }

  private checkUUID() {
    let uuid = crypto.randomUUID();
    this.records.forEach((record) => {
      if (record.id === uuid) uuid = this.checkUUID();
    });
    return uuid;
  }
}
