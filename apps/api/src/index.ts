import { buildServer } from './server.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const server = await buildServer(config);

const shutdown = async (signal: string) => {
  server.log.info({ signal }, 'shutting down');
  await server.close();
  process.exit(0);
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

try {
  await server.listen({ host: config.host, port: config.port });
} catch (err) {
  server.log.error(err, 'failed to start');
  process.exit(1);
}
