import 'reflect-metadata';
import 'dotenv/config';

import { In, LessThan, Not } from 'typeorm';

import { DataSource } from '#database';
import jobQueue, { BullProcessor, JobType } from '#job-queue';
import Note from '#modules/notes/entities/Note';
import { NoteStatus } from '#modules/notes/enums';
import { getDateToNearNoteExpiration } from '#modules/notes/utils';
import redis from '#redis';

import { addNoteExpireJob, noteExpireJobOptions } from '../expire-note';

const processor: BullProcessor<JobType.addJobsForNoteExpiration> = async () => {
  if (!DataSource.isInitialized) {
    throw new Error('Database not initialized');
  }

  if (redis.status !== 'ready') {
    throw new Error('Redis is not ready');
  }

  if (!jobQueue.isJobInitialized(noteExpireJobOptions.type)) {
    await jobQueue.initJob(noteExpireJobOptions);
  }

  const existJobs = await jobQueue.getJobs(JobType.expireNote);

  const targetDate = getDateToNearNoteExpiration();
  const notesToExpire = await Note.findBy({
    id: Not(In(existJobs.map((job) => job.data.id))),
    expirationDate: LessThan(targetDate),
    status: Not(NoteStatus.expired),
  });

  await Promise.all(notesToExpire.map(addNoteExpireJob));

  const noteIds = notesToExpire.map((note) => note.id);

  return {
    ids: noteIds,
    count: noteIds.length,
  };
};
export default processor;

export const addJobsForNoteExpirationProcessorPath = import.meta.url;
