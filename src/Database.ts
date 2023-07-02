interface IRecords {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export default class Database {
  private records: IRecords[] = [
    { id: '1', username: 'first1', age: 16, hobbies: ['dancing'] },
    { id: '2', username: 'first2', age: 18, hobbies: [] },
    { id: '3', username: 'first3', age: 20, hobbies: ['paying, skating'] },
    { id: '4', username: 'first4', age: 22, hobbies: [] },
  ];

  getRecords() {
    return this.records;
  }

  getRecord(id: string) {
    return this.records[id as keyof typeof this.records];
  }

  createRecord(record: IRecords) {
    record['id'] = (this.records.length + 1).toString();
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
}
