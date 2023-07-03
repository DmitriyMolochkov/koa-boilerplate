import { Server } from 'http';

import logger from '#logger';

const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

export default function onShutdown(server: Server) {
  const handleSignal = async (signal: string) => {
    signals.forEach((sig) => process.removeListener(sig, handleSignal));
    logger.info(`Received shutdown signal: ${signal}`);
    server.close(() => {
      process.kill(process.pid, signal);
    });
  };

  signals.forEach((signal: string) => process.on(signal, handleSignal));
}
