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
    let hash = generateRandomHash();
    let generationArgs = [name, `'${hash}'`, 'null' /* TODO figure out head migration */, getUsername(), (new Date()).toString(), description];

    let tokenizedScript = baseScript.split(' ');
    let interpolatedScriptTokens = [];
    let isFastForwarding = false;

    tokenizedScript.forEach((token, tokenIndex) => {
        let interpolatedToken = token;

        // if we're in dd mode, then ignore all tokens and if a token ends with a new line (\n), then unset fast-forward mode.
        if (isFastForwarding) {
            if (token.endsWith('\n')) {
                isFastForwarding = false;
            }

            return;
        }

        if (token.startsWith('$$')) {
            let optionalIndex = token.indexOf('?', 2);
            let endIndex = token.lastIndexOf('$$');
            let argIndexOrdinal = parseInt(token.substring(2, optionalIndex == -1 ? endIndex : optionalIndex));
            let actualArgIndexOrdinal = argIndexOrdinal - 1;
            let restOfTheToken = token.substring(endIndex + 2);

            if (optionalIndex !== -1) {
                if (!generationArgs[actualArgIndexOrdinal]) {
                    // TODO: probably should make it easier to provide different options
                    if (token.includes('dd', optionalIndex)) {
                        // if it's a dd (vim delete line), just skip its containing line
                        // rewind to last new line (contains \n) and remove each token, and then fast forward to the next token after new line (containing \n)

                        // Remove previous tokens on this line.
                        let i = tokenIndex - 1;
                        while (true) {
                            if (interpolatedScriptTokens[i].endsWith('\n') || i < 0) break;

                            interpolatedScriptTokens.splice(i, 1);

                            i--;
                        }

                        // Ignore tokens until we reach new line.
                        // Unless.. this token ends with a new line! Then we just ignore like normal lmao.
                        isFastForwarding = !token.endsWith('\n');

                        return;
                    }
                    else {
                        // simply skip this token :)
                        return;
                    }
                }
            }

            if (!generationArgs[actualArgIndexOrdinal]) {
                throw `Unexpected falsy value for argument index ${argIndexOrdinal} - it should be a string/int passed in. maybe interpolate it like this:\n\t\`'\${${generationArgs[actualArgIndexOrdinal]}}'\``;
            } else {
                interpolatedToken = generationArgs[actualArgIndexOrdinal] + restOfTheToken;
            }
        }

        interpolatedScriptTokens.push(interpolatedToken);
    });

    let interpolatedScript = interpolatedScriptTokens.join(' ');

    await writeFile(`${__dirname}/${hash}-${name}.js`, interpolatedScript);
}
