import { Docker, Options as DockerOptions } from 'docker-cli-js';

const dockerCommand = `docker run --name oshiete-db -e POSTGRES_USER=${process.env.POSTGRES_USER} POSTGRES_PASSWORD=${process.env.PGPASSWORD} -d postgres`;

let startDocker = function() {

};

let stopDocker = function() {

}

let cleanupDocker = function() {

}

export {
    startDocker,
    stopDocker,
    cleanupDocker,
}
