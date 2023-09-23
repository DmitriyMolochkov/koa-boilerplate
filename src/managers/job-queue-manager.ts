import jobQueue, { IBullOptions, IRepeatableBullOptions, JobType } from '#job-queue';
import { addJobsForNoteExpirationOptions } from '#modules/notes/jobs/add-jobs-for-note-expiration';
import { noteExpireJobOptions } from '#modules/notes/jobs/expire-note';

class JobQueueManager {
  private repeatableBullOptions = [
    addJobsForNoteExpirationOptions,
  ] as IRepeatableBullOptions<JobType>[];

  private bullOptions = [
    noteExpireJobOptions,
  ] as IBullOptions<JobType>[];

  public async init() {
    await jobQueue.initRepeatableJobs(this.repeatableBullOptions);
    await jobQueue.initJobs(this.bullOptions);
  }
}

export default new JobQueueManager();
