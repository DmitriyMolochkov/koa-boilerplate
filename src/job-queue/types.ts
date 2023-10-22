import {
  Job,
  Processor,
  Queue,
  Worker,
} from 'bullmq';

import { JobType } from './JobType';

export type JobModel<JobT extends JobType> = {
  [JobType.addJobsForNoteExpiration]: {
    payload: undefined;
    returnData: {
      ids: number[];
      count: number;
    };
  };
  [JobType.expireNote]: {
    payload: { id: number };
    returnData: { id: number };
  };
}[JobT] & { type: JobT };

export type BullJob<JobT extends JobType> =
  Job<JobModel<JobT>['payload'], JobModel<JobT>['returnData']>;

export type BullWorker<JobT extends JobType> =
  Worker<JobModel<JobT>['payload'], JobModel<JobT>['returnData']>;

export type BullQueue<JobT extends JobType> =
  Queue<JobModel<JobT>['payload'], JobModel<JobT>['returnData']>;

export type BullProcessor<JobT extends JobType> =
  Processor<JobModel<JobT>['payload'], JobModel<JobT>['returnData']>;
