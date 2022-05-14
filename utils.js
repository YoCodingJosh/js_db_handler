import ora from 'ora';

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
}

export {
    timeoutPromise,
    bookSpinner,
    sleepFunction,
    hasOnlyJavaScriptIdentiferSafeCharacters,
    stringIsNotJavaScriptReservedWord,
};
