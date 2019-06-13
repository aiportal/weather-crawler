import sqlite3 from 'sqlite3';
import bluebird from 'bluebird';


sqlite3.verbose();
const Database = bluebird.promisifyAll(new sqlite3.Database('./weather.db'));

async function execSqlite() {
  const res = await Database.exec('select * from aa');
}
