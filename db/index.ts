import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "doorway.db");

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS storefronts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    owner_name TEXT DEFAULT '',
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    website TEXT DEFAULT '',
    services TEXT NOT NULL,
    service_area TEXT DEFAULT '',
    description TEXT DEFAULT '',
    slug TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

export const db = drizzle(sqlite, { schema });