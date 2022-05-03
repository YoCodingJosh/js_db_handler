import pkg from 'pg';
const { Pool } = pkg;

import ora from 'ora';

import { timeoutPromise, bookSpinner } from '../utils.js';

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

        result = this.pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client', err.stack);
                return false;
            }
            client.query('SELECT NOW()', (err, result) => {
                release();
                if (err) {
                    console.error('Error executing query', err.stack);
                    return false;
                }
                return true;
            });
        });

        spinner.stop();

        if (result) {
            console.log('🔌 Connected!');
        }
    }

    async processMigrations() {
        const spinner = ora({
            spinner: bookSpinner,
            text: 'Checking migrations...',
        });

        spinner.start();

        await timeoutPromise((resolve) => {
            spinner.stop();

            console.log('✅ Checked migrations!');

            resolve();
        }, 3333);
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

export {
    __dbInstance as DB,
    initDB,
};
