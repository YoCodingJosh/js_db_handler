// process meta-stuff about migrations

import pkg from 'pg';

// TODO: do this once it gets out of the experimental state ;)
// import statuses from './migration-statuses.json' assert { type: 'json' };

import { readFile } from "fs/promises";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Checks if the table exists, if not creates it. Checks the available statuses and updates them if necessary.
 * @param {pkg.PoolClient} client 
 */
async function migrationStatusesTable(client) {
    let migrationStatusesJson = (await readFile(`${__dirname}/migration-statuses.json`)).toString();
    let migrationStatuses = JSON.parse(migrationStatusesJson).statuses;

    let tableName = 'migration_statuses';
    let tableExistanceCheck = `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = '${tableName}'`;

    let tableExistanceCheckResult = await client.query(tableExistanceCheck);

    // if there aren't any rows, then create the table.
    if (tableExistanceCheckResult.rowCount === 0) {
        let script = await (await readFile(`${__dirname}/create_migration_statuses_table.sql`)).toString();

        let tableCreationResult = await client.query(script);

        // Since we just created the table, lets add the data!

        // make sure it is sorted by the oridinal id.
        migrationStatuses = migrationStatuses.sort((a, b) => a.ordinal - b.ordinal);

        for (let i = 0; i < migrationStatuses.length; i++) {
            let status = migrationStatuses[i];
            console.log(status);

            let insertStatement = 'INSERT INTO migration_statuses(status, description) VALUES($1, $2)';
            let insertValues = [status.status, status.description];

            let dataInsertResult = await client.query(insertStatement, insertValues);
        }
    }
    else {
        let tableDataCheck = 'SELECT * FROM migration_statuses';

        let tableDataCheckResult = await client.query(tableDataCheck);

        // If there are no statuses, then we need to add them.
        if (tableDataCheckResult.rowCount === 0) {

        }
        else {
            // TODO: Check for any differences to the JSON (like field values or new/removed columns)
        }

        console.log(tableDataCheckResult);
    }
}

async function migrationsTable(client) {

}

/**
 * Create the database tables for meta migrations.
 * @param {pkg.PoolClient} client 
 */
async function createTables(client) {
    await migrationStatusesTable(client);
}

/**
 * Prepares the meta migrations
 * @param {pkg.PoolClient} client 
 */
export default async function prepare(client) {
    await createTables(client);
};
