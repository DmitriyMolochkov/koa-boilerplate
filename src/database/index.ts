import logger from '#logger';

import DataSource from './data-source';

async function initialize() {
  try {
    await DataSource.initialize();
  } catch (err) {
    logger.error(err, 'Error while initializing database');
  }
}

await initialize();

export {
  DataSource,
};
