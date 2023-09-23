import { IBullOptions, JobType } from '#job-queue';
import logger from '#logger';

// eslint-disable-next-line import/no-cycle
import { expireNoteProcessorPath } from './processor';

export const noteExpireJobOptions: IBullOptions<JobType.expireNote> = {
  type: JobType.expireNote,
  worker: {
    processor: expireNoteProcessorPath,
    completeHandler: async (job, result) => {
      logger.info(
        {
          id: result.id,
          jobId: job.id,
        },
        'Note successfully expired by job',
      );
    },
    errorHandler: async (job, error) => {
      logger.error(
        {
          id: job.data.id,
          jobId: job.id,
          error: {
            message: error.message,
            stack: error.stack,
          },
        },
        'Error while expire note by job',
      );
    },
  },
  job: {},
};
