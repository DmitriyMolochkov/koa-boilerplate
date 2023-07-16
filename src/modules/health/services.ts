import { DataSource } from '#database';
import { HealthComponentType, HealthStatus } from '#modules/health/enums';
import { IHealthResponse } from '#modules/health/models';

async function checkDbConnection() {
  try {
    await DataSource.manager.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export async function getDbHealthCheck() {
  return {
    componentType: HealthComponentType.datastore,
    status: await checkDbConnection() ? HealthStatus.ok : HealthStatus.error,
    time: new Date(),
  };
}

export function getServerHealthCheck() {
  return {
    componentType: HealthComponentType.system,
    status: HealthStatus.ok,
    time: new Date(),
  };
}

const weightByStatusObj: Record<HealthStatus, 1 | 2 | 3> = {
  ok: 1,
  warn: 2,
  error: 3,
};

const statusByWeightObj = Object.fromEntries(
  Object.entries(weightByStatusObj).map(([k, v]) => [v, k]),
) as Record<typeof weightByStatusObj[HealthStatus], HealthStatus>;

function getHeadStatus(statuses: HealthStatus[]) {
  const weights = statuses.map((s) => weightByStatusObj[s]);
  const maxWeight = Math.max(...weights) as typeof weightByStatusObj[HealthStatus];
  const status = statusByWeightObj[maxWeight];

  return status;
}

export async function getHealthCheckResponse(): Promise<IHealthResponse> {
  const serverCheck = getServerHealthCheck();
  const dbCheck = await getDbHealthCheck();
  const packageVersion = process.env['npm_package_version'];

  return {
    status: getHeadStatus([serverCheck, dbCheck].map((c) => c.status)),
    version: packageVersion?.split('.')[0],
    releaseId: packageVersion ?? '',
    description: 'health of the server',
    checks: {
      server: [serverCheck],
      'database:connection': [dbCheck],
    },
  };
}
