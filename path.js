// Unfortunately, you will need to copy/paste this if you need nested directory support.
// TODO: Look into using import.meta.resolve once it's not experimental?

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export {
    __filename,
    __dirname,
};
