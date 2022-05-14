import { config as dotenvConfig } from 'dotenv';

import { showHelp } from './helpers/help.js';
import { createContainer, startContainer, stopContainer, checkContainerCreated, checkContainerRunning, checkDocker, checkVolumeExists, createVolume, removeVolume, removeContainer } from './helpers/docker.js';
import { closeDB, DB, initDB } from './helpers/db.js';

import { __dirname } from './path.js'
import { hasOnlyJavaScriptIdentiferSafeCharacters, sleepFunction, stringIsNotJavaScriptReservedWord } from './utils.js';

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
    const wasContainerCreated = await checkContainerCreated();
    const wasVolumeCreated = await checkVolumeExists();

    if (!wasVolumeCreated) {
        await createVolume();
    }

    if (!wasContainerCreated) {
        await createContainer(process.env);
    }

    const wasContainerStarted = await checkContainerRunning();

    if (!wasContainerStarted) {
        await startContainer();
    }

    // there's a race condition between when the container is ready vs when postgres is ready
    if (!wasContainerCreated || !wasContainerStarted) {
        await sleepFunction(1250, '😴 Resting and waiting for Postgres to be ready...', '🌞 Well rested');
    }

    initDB(process.env);

    await DB.checkDatabaseConnection();

    await DB.processMigrations();

    closeDB();
}
else if (args[0] === '--stop-dev') {
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
else if (args[0] === '--reset-data') {
    try {
        if (await checkContainerCreated()) {
            if (await checkContainerRunning()) {
                await stopContainer();
            }
        
            await removeContainer();
        }

        if (await checkVolumeExists()) {
            await removeVolume();
        }

        console.log('🔥💾 Data was reset!');
    }
    catch (err) {
        throw err;
    }
}
else if (args[0] === '--create-migration') {
    if (args.length == 1) {
        console.error('❓ You need to pass in what you want to name your migration.');
        process.exit(-5);
    }

    if (!hasOnlyJavaScriptIdentiferSafeCharacters(args[1]) || !stringIsNotJavaScriptReservedWord(args[1])) {
        console.error('⛔ Migration name must be a valid JavaScript identifier and not a reserved word!');
        process.exit(-6);
    }

    // TODO: Implement
}
else if (args[0] === '--run-migrations') {

}
