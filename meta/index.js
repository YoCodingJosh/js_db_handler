// process meta-stuff about migrations

import { DB } from "../helpers/db.js";

import statuses from './migration-statuses.json' assert { type: 'json' };

import { readFile } from "fs/promises";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTables() {
    // Load SQL script
    let script = await (await readFile(`${__dirname}/create_tables.sql`)).toString();

    console.log(script);
}

export default async function prepare() {
    await createTables();
};
