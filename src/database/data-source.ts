import path from 'path';
import { fileURLToPath } from 'url';

import { DataSource } from 'typeorm';

import config, { dbConfig } from '#config';

const currentDirName = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(currentDirName, 'migrations', '*{.ts,.js}');

export default new DataSource({
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: false,
  logging: !config.isProduction,
  entities: [],
  subscribers: [],
  migrations: [migrationPath],
});
