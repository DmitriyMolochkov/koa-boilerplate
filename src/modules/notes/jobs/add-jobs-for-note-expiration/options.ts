import { IRepeatableBullOptions, JobType } from '#job-queue';
import logger from '#logger';

import { addJobsForNoteExpirationProcessorPath } from './processor';

const options: IRepeatableBullOptions<JobType.addJobsForNoteExpiration> = {
  type: JobType.addJobsForNoteExpiration,
  worker: {
    processor: addJobsForNoteExpirationProcessorPath,
    completeHandler: async (job, result) => {
      const { ids, count } = result;

      if (count > 0) {
        logger.info(
          {
            ids,
            count,
          },
          'Added jobs for notes expiration',
        );
      }
    },
  },
  job: {
    repeat: {
      pattern: '*/60 * * * * *',
    },
  },
};

export const addJobsForNoteExpirationOptions = options;
