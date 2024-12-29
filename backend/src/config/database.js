import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'node:path';

export async function initializeDatabase() {
  const db = await open({
    filename: join(process.cwd(), 'chat.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);

  return db;
}
