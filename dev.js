import { config as dotenvConfig } from 'dotenv';

import { showHelp } from './helpers/help.js';
import { startDocker } from './helpers/docker.js';

import { __dirname } from './path.js'

// force local env so no shenanigans can happen ;)
dotenvConfig({ path: `${__dirname}/local.env` });

var args = process.argv.slice(2);

if (args.length == 0 || args[0] === "--help") {
    showHelp();
}

if (args[0] === '--start-dev') {
    startDocker(process.env);
}
