import {
  FlowJob,
  JobsOptions,
  QueueEvents,
  Worker,
} from 'bullmq';
import { KeepJobs } from 'bullmq/dist/esm/interfaces';

import logger from '#logger';

import {
  IBullFlowJobOptions,
  IBullJobOptions,
  IBullJobRemoveOptions,
  IBullWorkerOptions,
} from './interfaces';
import { JobType } from './JobType';
import { BullQueue } from './types';

const defaultRemoveOnCompleteOpts: KeepJobs = {
  age: 2 * 24 * 60 * 60 * 1000, // 2 days
  count: 10_000,
};

const defaultRemoveOnFailOpts: KeepJobs = {
  age: 7 * 24 * 60 * 60 * 1000, // 7 days
  count: 1000,
};

export function buildJobRemovalOptions(opts: IBullJobRemoveOptions) {
  return {
    removeOnComplete: opts.removeOnComplete ?? defaultRemoveOnCompleteOpts,
    removeOnFail: opts.removeOnFail ?? defaultRemoveOnFailOpts,
  };
}

export function buildJobOptions(
  options: IBullJobOptions,
): JobsOptions {
  return {
    backoff: options.backoff ?? {
      delay: 60 * 1000, // 1 minute
      type: 'exponential',
    },
    attempts: options.attempts ?? 1,
    priority: options.priority,
    delay: options.delay,
    jobId: options.jobId,
    ...buildJobRemovalOptions(options),
  };
}

export function buildJobFlowOption(
  type: JobType,
  options: IBullFlowJobOptions,
): FlowJob {
  return {
    name: 'job',
    data: options.payload,
    queueName: type,
    opts: {
      failParentOnFailure: true,
      ...buildJobOptions(options),
    },
  };
}

export function handleWorkerEvents<
  DataType = unknown,
  ResultType = unknown,
  NameType extends string = string,
>(
  type: JobType,
  worker: Worker<DataType, ResultType, NameType>,
  completeHandler?: IBullWorkerOptions<DataType, ResultType>['completeHandler'],
  errorHandler?: IBullWorkerOptions<DataType, ResultType>['errorHandler'],
  haveSensitiveData = false,
) {
  worker.on('active', async (job) => {
    logger.info(
      {
        type,
        name: job.name,
        id: job.id,
        payload: haveSensitiveData ? undefined : job.data,
      },
      'Job is active',
    );
  });
  worker.on('completed', async (job, result) => {
    logger.info(
      {
        type,
        name: job.name,
        id: job.id,
        payload: haveSensitiveData ? undefined : job.data,
        result: haveSensitiveData ? undefined : result,
      },
      'Job completed',
    );

    if (completeHandler) {
      try {
        await completeHandler(job, result);
      } catch (handlerError) {
        logger.error(
          {
            type,
            name: job.name,
            id: job.id,
            payload: haveSensitiveData ? undefined : job.data,
            error: handlerError instanceof Error ? {
              message: handlerError.message,
              stack: handlerError.stack,
            } : handlerError,
          },
          'Cannot run complete handler for completed job',
        );
      }
    }
  });
  worker.on('failed', async (job, error) => {
    logger.error(
      {
        type,
        name: job?.name,
        id: job?.id,
        payload: haveSensitiveData ? undefined : job?.data,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      'Cannot execute job',
    );

    if (job && errorHandler) {
      try {
        await errorHandler(job, error);
      } catch (handlerError) {
        logger.error(
          {
            type,
            name: job.name,
            id: job.id,
            payload: haveSensitiveData ? undefined : job.data,
            error: handlerError instanceof Error ? {
              message: handlerError.message,
              stack: handlerError.stack,
            } : handlerError,
          },
          'Cannot run error handler for job failure',
        );
      }
    }
  });
  worker.on('error', (error) => {
    logger.error(
      {
        type,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      'Error in job worker',
    );
  });
}

export function handleQueueEvents<JobT extends JobType>(
  queue: BullQueue<JobT>,
  type: JobT,
  haveSensitiveData = false,
) {
  queue.on('removed', (job) => {
    logger.warn(
      {
        type,
        name: job.name,
        id: job.id,
        payload: haveSensitiveData ? undefined : job.data,
      },
      'Job removed from queue',
    );
  });

  queue.on('error', (error) => {
    logger.error(
      {
        type,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      'Error in job queue',
    );
  });
}

export function handleQueueEventsEvents(
  queueEvents: QueueEvents,
  type: JobType,
) {
  queueEvents.on('added', ({ jobId, name }) => {
    logger.info(
      {
        type,
        id: jobId,
        name,
      },
      'Job added in queue',
    );
  });
  queueEvents.on('duplicated', ({ jobId }) => {
    logger.warn(
      {
        type,
        id: jobId,
      },
      'Job duplicated',
    );
  });
  queueEvents.on('stalled', ({ jobId }) => {
    logger.warn(
      {
        type,
        id: jobId,
      },
      'Job stalled',
    );
  });
  queueEvents.on('error', (error) => {
    logger.error(
      {
        type,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      'Error in job queue events',
    );
  });
}
