import pkg from 'pg';
const { Pool } = pkg;

import ora from 'ora';

import { timeoutPromise, bookSpinner } from '../utils.js';

import prepareMetamigrations from '../meta/index.js';

function __createConnectionPool(env) {
    return new Pool({
        user: env.PGUSER,
        host: env.PGHOST,
        database: env.PGDATABASE,
        password: env.PGPASSWORD,
        port: env.PGPORT,
    });
}

class DB {
    /**
     * Creates instance of DB
     * @param {NodeJS.ProcessEnv|undefined} env environment variables with the connection details or undefined to just do static typing
     */
    constructor(env) {
        if (env === undefined) {
            // no-op so we can have some semblance of static typing
            return;
        }

        if (!DB.instance) {
            DB.instance = this;

            this.pool = __createConnectionPool(env);
        }

        return DB.instance;
    }

    async checkDatabaseConnection() {
        const spinner = ora({
            spinner: 'earth',
            text: 'Checking database connection...',
        });

        spinner.start();

        let result = true;

        result = await new Promise((resolve, reject) => {
            this.pool.connect((err, client, release) => {
                if (err) {
                    console.error('Error acquiring client', err.stack);
                    reject(err);
                }
                client.query('SELECT NOW()', (err, result) => {
                    release();
                    if (err) {
                        console.error('Error executing query', err.stack);
                        reject(err);
                    }
                    resolve(true);
                });
            });
        });

        spinner.stop();

        if (result) {
            console.log('📡 Connected!');
        }
    }

    async processMigrations() {
        const spinner = ora({
            spinner: bookSpinner,
            text: 'Checking migrations...',
        });

        spinner.start();

        await prepareMetamigrations(this.pool);

        spinner.stop();

        // TODO: tell user the outcome (like need to perform X migrations, or all good)
        console.log('📚✅ Done checking migrations.');
    }
};

/**
 * The database driver wrapper.
 */
let __dbInstance = new DB();

/**
 * Initializes the database driver
 * @param {NodeJS.ProcessEnv} env 
 */
function initDB(env) {
    __dbInstance = new DB(env);

    Object.freeze(__dbInstance);
}

function closeDB() {
    __dbInstance.pool.end();

    // unfreeze, so we can reinit later (not sure why tho)
    __dbInstance = undefined;
}

export {
    __dbInstance as DB,
    initDB,
    closeDB,
};
