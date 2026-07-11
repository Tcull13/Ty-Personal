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
    password_hash TEXT DEFAULT '',
    plan TEXT DEFAULT 'free',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storefront_id INTEGER NOT NULL REFERENCES storefronts(id),
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    storefront_id INTEGER NOT NULL REFERENCES storefronts(id),
    type TEXT NOT NULL,
    referrer TEXT DEFAULT '',
    ip TEXT DEFAULT '',
    user_agent TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// Migrations for existing DBs
try { sqlite.exec(`ALTER TABLE storefronts ADD COLUMN password_hash TEXT DEFAULT ''`); } catch {}
try { sqlite.exec(`ALTER TABLE storefronts ADD COLUMN plan TEXT DEFAULT 'free'`); } catch {}

export const db = drizzle(sqlite, { schema });