import { merge } from 'lodash-es';

import jobQueue, { JobType } from '#job-queue';
import logger from '#logger';
import Note from '#modules/notes/entities/Note';

// eslint-disable-next-line import/no-cycle
import { noteExpireJobOptions } from './options';

export async function addNoteExpireJob(noteToExpire: Note) {
  const delay = noteToExpire.expirationDate.getTime() - new Date().getTime();

  const options = merge(
    {
      job: {
        delay: delay > 0 ? delay : 0,
      },
    },
    noteExpireJobOptions,
  );

  const job = jobQueue.createJob(
    options,
    {
      id: noteToExpire.id,
    },
  );

  return job;
}

export async function removeNoteExpireJobs(noteId: Note['id']) {
  try {
    const jobs = await jobQueue.getJobs(JobType.expireNote);

    const jobsOfNote = jobs.filter((job) => job.data.id === noteId);

    await Promise.all(jobsOfNote.map(async (job) => job.remove()));
  } catch (error) {
    logger.error(error, 'Error while removing job');
  }
}
