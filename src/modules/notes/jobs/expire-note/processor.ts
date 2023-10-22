import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from '#database';
import { BullProcessor, JobType } from '#job-queue';
import * as NoteService from '#modules/notes/services';

const processor: BullProcessor<JobType.expireNote> = async (job) => {
  if (!DataSource.isInitialized) {
    throw new Error('Database not initialized');
  }

  const note = await NoteService.getById(job.data.id);

  await NoteService.expireNote(note);

  return {
    id: note.id,
  };
};

export default processor;

export const expireNoteProcessorPath = import.meta.url;
