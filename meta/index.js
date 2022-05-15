// process meta-stuff about migrations

import pkg from 'pg';

// TODO: do this once it gets out of the experimental state ;)
// import statuses from './migration-statuses.json' assert { type: 'json' };

import { readFile } from 'fs/promises';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let migrationStatusesJson = (await readFile(`${__dirname}/migration-statuses.json`)).toString();
let migrationStatuses = JSON.parse(migrationStatusesJson).statuses;

// make sure it is sorted by the ordinal id.
migrationStatuses = migrationStatuses.sort((a, b) => a.ordinal - b.ordinal);

async function insertStatusesIntoMigrationStatusesTable(client) {
    for (let i = 0; i < migrationStatuses.length; i++) {
        let status = migrationStatuses[i];

        let insertStatement = 'INSERT INTO migration_statuses(status, description) VALUES($1, $2)';
        let insertValues = [status.status, status.description];

        let dataInsertResult = await client.query(insertStatement, insertValues);
    }
}

/**
 * Checks if the table exists, if not creates it. Checks the available statuses and updates them if necessary.
 * @param {pkg.PoolClient} client 
 */
async function migrationStatusesTable(client) {
    let tableName = 'migration_statuses';
    let tableExistenceCheck = `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = '${tableName}'`;

    let tableExistenceCheckResult = await client.query(tableExistenceCheck);

    // if there aren't any rows, then create the table.
    if (tableExistenceCheckResult.rowCount === 0) {
        let script = await (await readFile(`${__dirname}/create_migration_statuses_table.sql`)).toString();

        let tableCreationResult = await client.query(script);

        // Since we just created the table, lets add the data!
        await insertStatusesIntoMigrationStatusesTable(client);
    }
    else {
        let tableDataCheck = 'SELECT * FROM migration_statuses';

        let tableDataCheckResult = await client.query(tableDataCheck);

        // If there are no statuses, then we need to add them.
        // This should never realistically happen, but ya never know... :S
        if (tableDataCheckResult.rowCount === 0) {
            // TODO: What if the statuses have changed from when the table was created?
            await insertStatusesIntoMigrationStatusesTable(client);
        }
        else {
            // TODO: Check for any differences to the JSON (like field values or new/removed columns)
        }
    }
}

/**
 * Create the migrations table.
 * @param {pkg.PoolClient} client 
 */
async function migrationsTable(client) {
    let tableName = 'migrations';
    let tableExistenceCheck = `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = '${tableName}'`;

    let tableExistenceCheckResult = await client.query(tableExistenceCheck);

    // if there aren't any rows, then create the table.
    if (tableExistenceCheckResult.rowCount === 0) {
        let script = await (await readFile(`${__dirname}/create_migrations_table.sql`)).toString();

        let tableCreationResult = await client.query(script);
    }
    else {
        // TODO: Handle this later.
    }
}

/**
 * Create the database tables for meta migrations.
 * @param {pkg.PoolClient} client 
 */
async function createTables(client) {
    await migrationStatusesTable(client);
    await migrationsTable(client);
}

/**
 * Prepares the meta migrations
 * @param {pkg.PoolClient} client 
 */
async function prepareMetamigrations(client) {
    await createTables(client);
};

/**
 * Checks the processed migrations and determines where to start.
 * @param {pkg.PoolClient} client 
 */
async function checkProcessedMigrations(client) {
    // TODO:
}

export {
    prepareMetamigrations,
    checkProcessedMigrations,
};
