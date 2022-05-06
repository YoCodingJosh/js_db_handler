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

export {
    timeoutPromise,
    bookSpinner,
    sleepFunction,
};
