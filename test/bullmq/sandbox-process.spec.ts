import { Job, Queue, Worker } from 'bullmq';
import { ChildPool } from 'bullmq/dist/esm/classes/child-pool';
import { v4 } from 'uuid';

import { foobarProcessorPath } from './foobar-processor.spec-helper';

describe('sandboxed process', () => {
  let queue: Queue;
  let queueName: string;
  type WorkerWithChildPool = Omit<Worker, 'childPool'> & { childPool: ChildPool };

  const connection = {
    host: 'localhost',
    port: 6379,
  };

  beforeEach(async () => {
    queueName = `test-${v4()}`;
    queue = new Queue(queueName, { connection });
  });

  afterEach(async () => {
    await queue.obliterate();
    await queue.close();
  });

  it('should work when processor file is ESM', async () => {
    const worker = new Worker(
      queueName,
      foobarProcessorPath,
      {
        connection,
        drainDelay: 1,
      },
    ) as unknown as WorkerWithChildPool;

    const completing = new Promise<void>((resolve, reject) => {
      worker.on('completed', async (job: Job, value: unknown) => {
        try {
          expect(job.data).toEqual({ foo: 'bar' });
          expect(value).toEqual(42);
          expect(Object.keys(worker.childPool.retained)).toHaveLength(0);
          expect(worker.childPool.free[foobarProcessorPath]).toHaveLength(1);
          await worker.close();
          resolve();
        } catch (error) {
          await worker.close();
          reject(error);
        }
      });
    });

    await queue.add('foobar', { foo: 'bar' });

    await completing;
  });
});
