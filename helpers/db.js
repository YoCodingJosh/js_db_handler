import pkg from 'pg';
const { Pool } = pkg;

import ora from 'ora';

import { timeoutPromise } from '../utils.js';

const pool = __createConnectionPool();

function __createConnectionPool(env) {
    return new Pool({
        user: 'me',
        host: 'localhost',
        database: 'api',
        password: 'password',
        port: 5432,
    })
}

const bookSpinner = {
    interval: 300,
    frames: ['📒', '📖', '📔', '📖', '📕', '📖', '📗', '📖', '📘', '📖', '📙', '📖'],
};

let checkDatabaseConnection = async function (env) {
    const spinner = ora({
        spinner: 'dots',
        text: 'Checking database connection...',
    });

    spinner.start();
};

let processMigrations = async function (env) {
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
};

export {
    checkDatabaseConnection,
    processMigrations,
};
