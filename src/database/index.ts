import logger from '#logger';

import DataSource from './data-source';

async function initialize() {
  try {
    await DataSource.initialize();
    logger.info('Database initialized');
  } catch (error) {
    logger.error(error, 'Error while initializing database');
  }
}

await initialize();

export {
  DataSource,
};
