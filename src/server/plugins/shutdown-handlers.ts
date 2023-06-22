import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

const shutdownHandlers: FastifyPluginAsync = async (server) => {
  const handleSignal = async (signal: string) => {
    signals.forEach((sig) => process.removeListener(sig, handleSignal));
    console.log('Received shutdown signal:', signal);
    await server.close();

    process.kill(process.pid, signal);
  };

  signals.forEach((signal: string) => process.on(signal, handleSignal));
};

export default fp(shutdownHandlers);
