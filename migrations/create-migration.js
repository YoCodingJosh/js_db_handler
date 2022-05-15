import { readFile, writeFile } from 'fs/promises';

import path from 'path';
import { fileURLToPath } from 'url';
import { generateRandomHash, getUsername } from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a migration with the provided name and descripton
 * @param {String} name 
 * @param {String} description 
 */
export default async function createMigration(name, description) {
    let baseScript = (await readFile(`${__dirname}/__migration_template.js`)).toString();
    let generationArgs = [name, generateRandomHash(), 'null' /* TODO figure out head migration */, getUsername(), (new Date()).toString(), description];

    let tokenizedScript = baseScript.split(' ');
    let interpolatedScriptTokens = [];
    let isFastForwarding = false;

    tokenizedScript.forEach(token => {
        console.log(token);

        let interpolatedToken = token;

        if (token.startsWith('$$')) {
            let optionalIndex = token.indexOf('?', 2);
            let argIndexOrdinal = parseInt(token.substring(2, optionalIndex == -1 ? undefined : optionalIndex));
            let actualArgIndexOrdinal = argIndexOrdinal - 1;

            if (optionalIndex !== -1) {
                if (!generationArgs[actualArgIndexOrdinal]) {
                    // TODO: probably should make it easier to provide different options
                    if (token.substring(optionalIndex).endsWith('dd')) {
                        // if it's a dd (vim delete line), just skip it's containing line
                        // TODO: rewind to last new line (contains \n) and remove each token, and then fast forward to next token after new line (containing \n)
                        //      this will be a pain in the ass
                    }
                    else {
                        // simply skip this token :)
                        return;
                    }
                }
            }

            if (!generationArgs[actualArgIndexOrdinal]) {
                throw `Unexpected falsy value for argument index ${argIndexOrdinal} - it should be a string/int passed in`;
            } else {
                interpolatedToken = generationArgs[actualArgIndexOrdinal];
            }
        }

        interpolatedScriptTokens.push(interpolatedToken);
    });

    let interpolatedScript = interpolatedScriptTokens.join(' ');

    console.log(interpolatedScript);
}
