import path from 'path';
import url from 'url';

export const rootDir = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
