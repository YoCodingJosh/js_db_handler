import { Docker, Options as DockerOptions } from 'docker-cli-js';

import { __dirname } from '../path.js';

// muda muda muda!
import ora from 'ora';

const defaultDockerOptions = new DockerOptions(null, __dirname, false);

const containerName = 'oshiete-db';
const volumeName = 'oshiete-data-volume';

let createVolume = async function () {
    const command = `volume create ${volumeName}`;

    try {
        await __dockerPromiseWrapper(command);
    }
    catch (err) {
        throw err;
    }
};

let checkVolumeExists = async function () {
    const command = `volume ls -q`;

    try {
        let data = await __dockerPromiseWrapper(command);

        // for some reason we only get the raw output? oh well, just do a includes for our volume name.
        return data.raw.includes(volumeName);
    }
    catch (err) {
        throw err;
    }
};

let removeVolume = async function () {
    const command = `volume rm ${volumeName}`;

    try {
        await __dockerPromiseWrapper(command);
    }
    catch (err) {
        throw err;
    }
}

/**
 * Pulls the latest Postgres Docker images and starts the database.
 * @param {NodeJS.ProcessEnv} env Environment variables that have the database credentials
 */
let createContainer = async function (env) {
    const pullPostgresImageCommand = `pull postgres:${env.PGVERSION}`;
    const startCommand = `run -p ${env.PGPORT}:${env.PGPORT} --name ${containerName} -e POSTGRES_USER=${env.PGUSER} -e POSTGRES_DB=${env.PGDATABASE} -e POSTGRES_PASSWORD=${env.PGPASSWORD} -v ${volumeName}:/var/lib/postgresql/data -d postgres:${env.PGVERSION}`;

    const spinner = ora({
        spinner: 'line',
        text: `Pulling Postgres ${env.PGVERSION} image...`,
    });

    spinner.start();

    try {
        await __dockerPromiseWrapper(pullPostgresImageCommand);

        spinner.clear();

        console.log(`✅ Pulled Postgres ${env.PGVERSION} image!`);

        spinner.text = 'Starting Postgres...';

        await __dockerPromiseWrapper(startCommand);

        spinner.stop();
        console.log('✅ Started Postgres!');
    }
    catch (err) {
        throw err;
    }
};

/**
 * EZPZ wrapper around the stupid callbacks because the wrapper I'm using is stupid
 * @param {string} command Command for docker to run 
 * @param {DockerOptions?} options Optional options to pass in to Docker. Defaults to defaultDockerOptions defined at the top 
 * @returns {Promise} a promise that you'll need to await to snatch that value
 */
async function __dockerPromiseWrapper(command, options) {
    if (!options) options = defaultDockerOptions
    let docker = new Docker(options);

    return new Promise((resolve, reject) => {
        docker.command(command, (err, data) => {
            if (err === null) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
};

let startContainer = async function () {
    const spinner = ora({
        spinner: 'arc',
        text: `Starting Postgres...`,
    });

    spinner.start();

    try {
        await __dockerPromiseWrapper(`start ${containerName}`);

        spinner.stop();
        console.log('🚀 Postgres started!');
    }
    catch (err) {
        spinner.stop();

        throw err;
    }
};

/**
 * Stops the database container
 */
let stopContainer = async function () {
    const spinner = ora({
        spinner: 'circleHalves',
        text: `Stopping Postgres...`,
    });

    spinner.start();

    try {
        await __dockerPromiseWrapper(`stop ${containerName}`);

        spinner.stop();
        console.log('✋ Postgres stopped!');
    }
    catch (err) {
        spinner.stop();

        throw err;
    }
};

async function __getContainerInfo() {
    try {
        let output = await __dockerPromiseWrapper('ps --all');

        return output.containerList.find(x => x.names === containerName);
    }
    catch (err) {
        // just bubble up like soda pop
        throw err;
    }
};

let checkContainerCreated = async function () {
    try {
        return await __getContainerInfo() !== undefined;
    }
    catch (err) {
        throw err;
    }
};

let checkContainerRunning = async function () {
    try {
        let data = await __getContainerInfo();

        return data !== undefined && data.status.startsWith('Up')
    }
    catch (err) {
        throw err;
    }
};

/**
 * Checks to see if Docker is installed and the daemon has been started.
 * @returns {Promise<boolean>} true if Docker is installed and started, false otherwise.
 */
let checkDocker = async function () {
    try {
        await __dockerPromiseWrapper('info');

        return true;
    }
    catch {
        return false;
    }
};

let cleanUpContainer = async function () {
    // TODO
};

export {
    createVolume,
    checkVolumeExists,
    removeVolume,
    createContainer,
    startContainer,
    stopContainer,
    checkContainerCreated,
    checkContainerRunning,
    checkDocker,
    cleanUpContainer,
};
