import path from 'path';

import { DataSource } from 'typeorm';

import config, { dbConfig } from '#config';
import { rootDir } from '#utils';

const migrationPath = path.join(rootDir, 'database', 'migrations', '*{.ts,.js}');
const entitiesPath = path.join(rootDir, 'modules', '*', 'entities', '*{.ts,.js}');

export default new DataSource({
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: false,
  logging: !config.isProduction,
  entities: [entitiesPath],
  subscribers: [],
  migrations: [migrationPath],
});
