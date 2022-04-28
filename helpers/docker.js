import { Docker, Options as DockerOptions } from 'docker-cli-js';

import { __dirname } from '../path.js';

import ora from 'ora';

/**
 * Pulls the latest Postgres Docker images and starts the database.
 * @param {NodeJS.ProcessEnv} env Environment variables that have the database credentials
 */
let startDocker = function(env) {
    const pullPostgresImageCommand = 'pull postgres';
    const startCommand = `run -p ${env.PGPORT}:${env.PGPORT} --name oshiete-db -e POSTGRES_USER=${env.PGUSER} -e POSTGRES_PASSWORD=${env.PGPASSWORD} -d postgres`;

    let options = new DockerOptions(null, __dirname, false);
    let docker = new Docker(options);

    const spinner = ora({
        spinner: 'line',
        text: 'Pulling latest Postgres image...',
    });

    spinner.start();

    docker.command(pullPostgresImageCommand).then((data) => {
        spinner.clear();

        console.log('✅ Pulled latest Postgres image');
        
        spinner.text = 'Starting Postgres...';

        docker.command(startCommand).then((data) => {
            spinner.stop();
            console.log('✅ Started Postgres!');
        });
    });
};

let stopDocker = function() {

};

let checkContainerCreated = function() {

};

let checkDockerInstalled = function() {

};

let cleanupDocker = function() {

};

export {
    startDocker,
    stopDocker,
    checkContainerCreated,
    checkDockerInstalled,
    cleanupDocker,
}
