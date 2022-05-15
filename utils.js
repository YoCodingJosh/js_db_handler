import ora from 'ora';

import { createHmac } from 'crypto';

/**
 * Executes a function when after a specified amount of time has been elasped.
 * @param {Function} callback callback that passes in resolve and reject
 * @param {Number} time Time in milliseconds before the callback is called.
 * @returns {Promise} the promise
 */
let timeoutPromise = function (callback, time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            callback(resolve, reject)
        }, time);
    });
};

const bookSpinner = {
    interval: 300,
    frames: ['📒', '📖', '📔', '📖', '📕', '📖', '📗', '📖', '📘', '📖', '📙', '📖'],
};

let sleepFunction = async function (time, waitMessage, completeMessage) {
    let spinner = ora({
        spinner: 'simpleDotsScrolling',
        text: waitMessage ?? `Sleeping for ${time} ms...`,
    });

    spinner.start();

    await timeoutPromise((resolve) => {
        spinner.stop();

        if (completeMessage) {
            console.log(completeMessage);
        }

        resolve();
    }, time);
};

let hasOnlyJavaScriptIdentiferSafeCharacters = function (str) {
    return /[a-zA-Z_$][0-9a-zA-Z_$]*/.test(str);
};

let stringIsNotJavaScriptReservedWord = function (str) {
    // there should be a better way to do this lmao (not using eval!)
    let naughtyWords = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
        'default', 'delete', 'for', 'else', 'export', 'extends', 'finally',
        'do', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
        'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void',
        'while', 'with', 'yield', 'enum', 'implements', 'interface', 'await',
        'package', 'private', 'protected', 'public', 'static', 'yield', 'let',
    ];

    return !naughtyWords.includes(str);
};

/**
 * generates a random hash string - meant for migration ids
 * @returns a hash of the date and a cool string
 */
let generateRandomHash = function() {
    return createHmac('SHA1', 'HYPEWORKS #1').update(Buffer.from(new String(new Date().getTime()), 'utf-8')).digest('hex');
};

/**
 * Gets the user name from the OS.
 * @returns the currently logged in user's username
 */
let getUsername = function() {
    // TODO: Maybe check git user?
    return process.env.USER ?? process.env.USERNAME;
};

export {
    timeoutPromise,
    bookSpinner,
    sleepFunction,
    hasOnlyJavaScriptIdentiferSafeCharacters,
    stringIsNotJavaScriptReservedWord,
    generateRandomHash,
    getUsername,
};
