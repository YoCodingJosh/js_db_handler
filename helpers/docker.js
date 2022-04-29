import { Docker, Options as DockerOptions } from 'docker-cli-js';

import { __dirname } from '../path.js';

// muda muda muda!
import ora from 'ora';

const defaultDockerOptions = new DockerOptions(null, __dirname, false);

/**
 * Pulls the latest Postgres Docker images and starts the database.
 * @param {NodeJS.ProcessEnv} env Environment variables that have the database credentials
 */
let createContainer = function (env) {
    const pullPostgresImageCommand = `pull postgres:${env.PGVERSION}`;
    const startCommand = `run -p ${env.PGPORT}:${env.PGPORT} --name oshiete-db -e POSTGRES_USER=${env.PGUSER} -e POSTGRES_PASSWORD=${env.PGPASSWORD} -d postgres:${env.PGVERSION}`;

    let docker = new Docker(defaultDockerOptions);

    const spinner = ora({
        spinner: 'line',
        text: `Pulling Postgres ${env.PGVERSION} image...`,
    });

    spinner.start();

    docker.command(pullPostgresImageCommand).then((data) => {
        spinner.clear();

        console.log(`✅ Pulled Postgres ${env.PGVERSION} image!`);

        spinner.text = 'Starting Postgres...';

        docker.command(startCommand).then((data) => {
            spinner.stop();
            console.log('✅ Started Postgres!');
        });
    });
};

/**
 * EZPZ wrapper around the stupid callbacks because the wrapper I'm using is stupid
 * @param {string} command Command for docker to run 
 * @param {DockerOptions|undefined} options Optional options to pass in to Docker. Defaults to defaultDockerOptions defined at the top 
 * @returns {Promise} a promise that you'll need to await to snatch that value
 */
function __dockerPromiseWrapper(command, options) {
    if (options === undefined) options = defaultDockerOptions
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
}

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
        await __dockerPromiseWrapper('stop oshiete-db');

        spinner.stop();
        console.log('✋ Postgres stopped!');
    }
    catch (err) {
        spinner.stop();

        // try to be a bit smart
        if (err.stderr === 'Error response from daemon: No such container: oshiete-db\n') {
            console.log('💡 Couldn\'t stop the Postgres container. Perhaps it was not running?');
        } else {
            console.error(err.stderr);
        }
    }
};

let checkContainerCreated = function () {
};

let checkContainerRunning = function () {

};

/**
 * Checks to see if Docker is installed and the daemon has been started.
 * @returns {Boolean} true if Docker is installed and started, false otherwise.
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

let cleanupDocker = function () {

};

export {
    createContainer,
    stopContainer,
    checkContainerCreated,
    checkContainerRunning,
    checkDocker,
    cleanupDocker,
}
