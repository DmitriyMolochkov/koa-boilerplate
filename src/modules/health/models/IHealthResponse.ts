// Refer to the following link for more details: https://inadarei.github.io/rfc-healthcheck/

import { HealthComponentType } from '#modules/health/enums/HealthComponentType';
import { HealthStatus } from '#modules/health/enums/HealthStatus';

export interface IHealthCheck {
  componentId?: string;
  componentType?: HealthComponentType;
  observedValue?: unknown;
  observedUnit?: string;
  status?: HealthStatus;
  affectedEndpoints?: string;
  time?: Date;
  output?: string;
  links?: Record<string, string>;
}

export interface IHealthResponse {
  status: HealthStatus;
  version?: string;
  releaseId?: string;
  notes?: string[];
  output?: string;
  serviceId?: string;
  description?: string;
  checks?: Record<string, [IHealthCheck]>;
  links?: Record<string, string>;
}
