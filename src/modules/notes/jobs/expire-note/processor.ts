import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from '#database';
import { BullProcessor, JobType } from '#job-queue';

const processor: BullProcessor<JobType.expireNote> = async (job) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax,import/no-cycle
  const noteService = await import('#modules/notes/services');

  if (!DataSource.isInitialized) {
    throw new Error('Database not initialized');
  }

  const note = await noteService.getById(job.data.id);

  await noteService.expireNote(note);

  return {
    id: note.id,
  };
};

export default processor;

export const expireNoteProcessorPath = import.meta.url;
