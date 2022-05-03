import { config as dotenvConfig } from 'dotenv';

import { showHelp } from './helpers/help.js';
import { createContainer, startContainer, stopContainer, checkContainerCreated, checkContainerRunning, checkDocker } from './helpers/docker.js';
import { DB, initDB } from './helpers/db.js';

import { __dirname } from './path.js'

// force local env so no shenanigans can happen ;)
dotenvConfig({ path: `${__dirname}/local.env` });

var args = process.argv.slice(2);

if (args.length == 0 || args[0] === "--help") {
    showHelp();

    process.exit(0);
}

if (!await checkDocker()) {
    console.error('❌ Could not detect Docker. Make sure it is installed and started!');
    process.exit(-1);
}

if (args[0] === '--start-dev') {
    const isFreshStart = !await checkContainerCreated();
    if (isFreshStart) {
        await createContainer(process.env);
    }

    if (!await checkContainerRunning()) {
        await startContainer();
    }
    else {
        if (!isFreshStart) {
            console.log('😸 Postgres already started.');
        }
    }

    initDB(process.env);

    await DB.checkDatabaseConnection();
}

if (args[0] == '--stop-dev') {
    if (!await checkContainerCreated()) {
        console.log('💡 Could not stop the Postgres container. Perhaps it was not created? 🤔💭💀');
        process.exit(-2);
    }

    if (!await checkContainerRunning()) {
        console.log('💡 Could not stop the Postgres container. Perhaps it is not running? 🤔💭🏃‍♂️');
        process.exit(-3);
    }

    await stopContainer();
}
