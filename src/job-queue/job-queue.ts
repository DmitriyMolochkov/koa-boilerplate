import {
  FlowJob,
  FlowProducer,
  JobType as JobStatus,
  Queue,
  QueueEvents,
  QueueEventsOptions,
  QueueOptions,
  Worker,
  WorkerOptions,
} from 'bullmq';

import { serverConfig } from '#config';
import logger from '#logger';
import redis from '#redis';
import { errorToObject } from '#utils';

import { IBullFlowJobOptions, IBullOptions, IRepeatableBullOptions } from './interfaces';
import { JobType } from './JobType';
import {
  BullJob,
  BullQueue,
  BullWorker,
  JobModel,
} from './types';
import {
  buildJobFlowOption,
  buildJobOptions,
  buildJobRemovalOptions,
  handleQueueEvents,
  handleQueueEventsEvents,
  handleWorkerEvents,
  hideContentIfNeeded,
} from './utils';

interface Section<JobT extends JobType> {
  workers: BullWorker<JobT>[];
  queue: BullQueue<JobT>;
  queueEvents: QueueEvents;
}

class JobQueue {
  private jobRedisPrefix = `${serverConfig.domain}:bull-queue`;

  public queues: { [JobT in JobType]?: BullQueue<JobT> } = {};
  private workers: { [JobT in JobType]?: BullWorker<JobT> } = {};
  private queueEvents: { [JobT in JobType]?: QueueEvents } = {};

  private sections: { [JobT in JobType]?: Section<JobT> } = {};

  private flowProducer: FlowProducer;

  public constructor() {
    this.flowProducer = new FlowProducer({
      connection: redis,
      prefix: this.jobRedisPrefix,
    });

    this.flowProducer.on('error', (error) => {
      logger.error(error, 'Error in flow producer');
    });
  }

  public isJobInitialized = (type: JobType) => Boolean(this.sections[type]);

  public async initRepeatableJob<JobT extends JobType>(bullOptions: IRepeatableBullOptions<JobT>) {
    const { type, job: jobOptions } = bullOptions;

    if (this.isJobInitialized(type)) {
      throw new Error(`Repeatable job with type '${type}' has already been initialized`);
    }

    const queue = this.buildQueue(bullOptions);
    const queueEvents = this.buildQueueEvents(type);

    const section: Section<JobType> = {
      workers: [],
      queue,
      queueEvents,
    };

    const existJobs = await queue.getRepeatableJobs();

    if (jobOptions.repeat === false) {
      await Promise.all(existJobs.map((job) => queue.removeRepeatableByKey(job.key)));
    } else {
      try {
        const pattern = jobOptions.repeat.pattern ?? jobOptions.repeat.every;
        const jobsToRemove = existJobs.filter((job) => job.pattern !== pattern);
        await Promise.all(jobsToRemove.map((job) => queue.removeRepeatableByKey(job.key)));

        await queue.add('job', undefined, {
          repeat: jobOptions.repeat,
          ...buildJobRemovalOptions(jobOptions),
        });
      } catch (error) {
        logger.error(
          {
            type,
            error: errorToObject(error),
          },
          'Cannot add repeatable job',
        );
      }

      const worker = this.buildWorker(bullOptions);

      section.workers.push(worker);
    }

    this.sections[bullOptions.type] = section as typeof this.sections[JobT];
  }

  public async initRepeatableJobs(array: IRepeatableBullOptions<JobType>[]) {
    await Promise.all(array.map(this.initRepeatableJob.bind(this)));
  }

  public async initJob<JobT extends JobType>(bullOptions: IBullOptions<JobT>) {
    const { type } = bullOptions;

    if (this.isJobInitialized(type)) {
      throw new Error(`Job with type '${type}' has already been initialized`);
    }

    const queue = this.buildQueue(bullOptions);
    const queueEvents = this.buildQueueEvents(type);
    const worker = this.buildWorker(bullOptions);

    this.sections[type] = {
      workers: [worker],
      queue,
      queueEvents,
    } as typeof this.sections[JobT];

    return this.sections[type];
  }

  public async initJobs(array: IBullOptions<JobType>[]) {
    await Promise.all(array.map(this.initJob.bind(this)));
  }

  private buildWorker<JobT extends JobType>(bullOptions: IBullOptions<JobT>) {
    const { type, worker: workerOptions, haveSensitiveData } = bullOptions;

    const options: WorkerOptions = {
      autorun: false,
      concurrency: workerOptions.concurrency ?? 1,
      prefix: this.jobRedisPrefix,
      connection: redis,
      maxStalledCount: 10,
    };

    const worker = new Worker(type, workerOptions.processor, options);

    handleWorkerEvents(
      type,
      worker,
      workerOptions.completeHandler,
      workerOptions.errorHandler,
      haveSensitiveData,
    );

    this.workers[type] = worker as typeof this.workers[JobT];

    return worker;
  }

  private buildQueue<JobT extends JobType>(bullOptions: IBullOptions<JobT>) {
    const { type, haveSensitiveData } = bullOptions;

    const queueOptions: QueueOptions = {
      connection: redis,
      prefix: this.jobRedisPrefix,
    };

    const queue: BullQueue<JobT> = new Queue(
      type,
      queueOptions,
    );

    handleQueueEvents(queue, type, haveSensitiveData);

    this.queues[type] = queue as typeof this.queues[JobT];

    return queue;
  }

  private buildQueueEvents(type: JobType) {
    const queueEventsOptions: QueueEventsOptions = {
      autorun: false,
      connection: redis,
      prefix: this.jobRedisPrefix,
    };

    const queueEvents = new QueueEvents(type, queueEventsOptions);
    handleQueueEventsEvents(queueEvents, type);

    this.queueEvents[type] = queueEvents;

    return queueEvents;
  }

  async start() {
    const promises = Object.values(this.sections)
      .map((section) => [
        ...section.workers.map((worker) => worker.run()),
        section.queueEvents.run(),
      ])
      .flat();

    return Promise.all(promises);
  }

  async terminate(isForce = false) {
    const promises = Object.values(this.sections)
      .map((section) => {
        const result = [
          ...section.workers.map((worker) => worker.close(isForce)),
          section.queue.close(),
        ];

        if (redis.status === 'ready') {
          result.push(section.queueEvents.close());
        }

        return result;
      })
      .flat();

    return Promise.all(promises);
  }

  async createJob<JobT extends JobType>(
    bullOptions: IBullOptions<JobT>,
    payload: JobModel<JobT>['payload'],
  ): Promise<BullJob<JobT> | undefined> {
    const { type, job: jobOptions, haveSensitiveData } = bullOptions;

    try {
      const queue = this.queues[type];
      if (!queue) {
        throw new Error(`Unknown queue with type '${type}': cannot create job.`);
      }

      const options = buildJobOptions(jobOptions);

      const job = await queue.add('job', payload, options);

      return job;
    } catch (error) {
      logger.error(
        {
          type,
          payload: hideContentIfNeeded(payload, haveSensitiveData ?? false),
          error: errorToObject(error),
        },
        'Cannot create job',
      );

      return undefined;
    }
  }

  async getJobs<JobT extends JobType>(
    type: JobT,
    statuses: JobStatus | JobStatus[] = [
      'active',
      'delayed',
      'prioritized',
      'waiting',
      'waiting-children',
      'paused',
      'repeat',
      'wait',
    ],
  ) {
    const queue = this.queues[type];
    if (!queue) {
      throw new Error(`Queue '${type}' not found`);
    }

    const jobs = await queue.getJobs(statuses);

    return jobs;
  }

  createSequentialJobFlow(...options: [IBullFlowJobOptions, ...IBullFlowJobOptions[]]) {
    const flowJob = options
      .slice(1)
      .reduce<FlowJob>((lastJobOpts, currentJobOpts) => {
        return {
          ...buildJobFlowOption(currentJobOpts.type, currentJobOpts),
          children: [lastJobOpts],
        };
      }, buildJobFlowOption(options[0].type, options[0]));

    return this.flowProducer.add(flowJob);
  }

  createJobWithChildren(parent: IBullFlowJobOptions, children: IBullFlowJobOptions[]) {
    return this.flowProducer.add({
      ...buildJobFlowOption(parent.type, parent),
      children: children.map((child) => buildJobFlowOption(child.type, child)),
    });
  }
}

export default new JobQueue();
