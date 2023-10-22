import { Job, JobsOptions, WorkerOptions } from 'bullmq';
import { Processor } from 'bullmq/dist/esm/interfaces';
import { BaseJobOptions, DefaultJobOptions } from 'bullmq/dist/esm/interfaces/base-job-options';

import { JobType } from './JobType';
import { JobModel } from './types';

export interface IBullWorkerOptions<Payload = unknown, ReturnData = unknown> {
  readonly concurrency?: WorkerOptions['concurrency'];
  readonly processor: string | Processor<Payload, ReturnData>;
  readonly completeHandler?: (job: Job<Payload, ReturnData>, result: ReturnData) => Promise<void>;
  readonly errorHandler?: (job: Job<Payload, ReturnData>, error: Error) => Promise<void>;
}

export interface IBullJobRemoveOptions {
  removeOnComplete?: DefaultJobOptions['removeOnComplete'];
  removeOnFail?: DefaultJobOptions['removeOnFail'];
}

interface IBullJobCommonOptions extends IBullJobRemoveOptions {
  readonly backoff?: DefaultJobOptions['backoff'];
  readonly attempts?: DefaultJobOptions['attempts'];
}

interface IBullRepeatableJobOptions extends IBullJobCommonOptions {
  readonly repeat: Exclude<BaseJobOptions['repeat'], undefined> | false;
}

export interface IBullJobOptions extends IBullJobCommonOptions {
  readonly delay?: JobsOptions['delay'];
  readonly priority?: JobsOptions['priority'];
  readonly jobId?: BaseJobOptions['jobId'];
}

export interface IBullFlowJobOptions<JobT extends JobType = JobType> extends IBullJobOptions {
  readonly type: JobT;
  readonly failParentOnFailure?: JobsOptions['failParentOnFailure'];
  readonly payload: JobModel<JobT>['payload'];
}

export interface IBullOptions<JobT extends JobType> {
  readonly type: JobT;
  readonly haveSensitiveData?: boolean;
  readonly worker: IBullWorkerOptions<JobModel<JobT>['payload'], JobModel<JobT>['returnData']>;
  readonly job: IBullJobOptions;
}

export interface IRepeatableBullOptions<JobT extends JobType> {
  readonly type: JobT;
  readonly haveSensitiveData?: boolean;
  readonly job: IBullRepeatableJobOptions;
  readonly worker: IBullWorkerOptions<JobModel<JobT>['payload'], JobModel<JobT>['returnData']>;
}
