import path from 'path';
import { fileURLToPath } from 'url';

export const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
