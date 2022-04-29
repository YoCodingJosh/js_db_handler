import { config as dotenvConfig } from 'dotenv';

import { showHelp } from './helpers/help.js';
import { createContainer, stopContainer, checkContainerCreated, checkContainerRunning, checkDocker } from './helpers/docker.js';

import { __dirname } from './path.js'

// force local env so no shenanigans can happen ;)
dotenvConfig({ path: `${__dirname}/local.env` });

var args = process.argv.slice(2);

if (args.length == 0 || args[0] === "--help") {
    showHelp();
}

if (!await checkDocker()) {
    console.error('❌ Could not detect Docker. Make sure it is installed and started!');
    process.exit(-1);
}

if (args[0] === '--start-dev') {
    createContainer(process.env);
}

if (args[0] == '--stop-dev') {
    await stopContainer();
}
