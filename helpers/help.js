import { __dirname } from '../path.js'

let showHelp = function () {
    console.log('oshiete database helper tool. you\'re welcome\nCopyright (c) HYPEWORKS Limited Company, 2022\n');
    console.log('--start-dev : starts docker and runs any migrations')
    console.log('<no params> or --help : shows this lovely message');
    console.log(`\nhelpful tip: you can find the local database credentials in:\n\t${__dirname}/local.env`);
}

export {
    showHelp,
};
