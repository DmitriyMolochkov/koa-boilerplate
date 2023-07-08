import { Server } from 'http';

import { DataSource } from '#database';
import logger from '#logger';

const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

export default function onShutdown(server: Server) {
  const handleSignal = async (signal: string) => {
    logger.info(`Received shutdown signal: ${signal}`);
    signals.forEach((sig) => process.removeListener(sig, handleSignal));

    await new Promise((resolve) => {
      server.close(resolve);
    });

    if (DataSource.isInitialized) {
      await DataSource.destroy();
    }

    process.kill(process.pid, signal);
  };

  signals.forEach((signal: string) => process.on(signal, handleSignal));
}
