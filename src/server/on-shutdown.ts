import { Server } from 'http';
import * as util from 'util';

import { DataSource } from '#database';
import logger from '#logger';

const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

async function shutdownServer(server: Server) {
  try {
    await util.promisify(server.close.bind(server))();

    if (DataSource.isInitialized) {
      await DataSource.destroy();
    }
  } catch (error) {
    logger.error(error, 'Error while shutdown the server');
  }
}

export default function onShutdown(server: Server) {
  const handleSignal = async (signal: string) => {
    logger.info(`Received shutdown signal: ${signal}`);
    signals.forEach((sig) => process.removeListener(sig, handleSignal));

    await shutdownServer(server);

    process.kill(process.pid, signal);
  };

  signals.forEach((signal: string) => process.on(signal, handleSignal));

  process.on('uncaughtException', async (error) => {
    logger.fatal(error, 'Uncaught exception');

    await shutdownServer(server);

    process.exit(1);
  });

  process.on('unhandledRejection', async (error) => {
    logger.fatal(error, 'Unhandled promise rejection');

    await shutdownServer(server);

    process.exit(1);
  });
}
