import { KoaContext } from '#modules/common/models';
import { IHealthResponse } from '#modules/health/models/IHealthResponse';
import * as HealthService from '#modules/health/services';

export async function healthCheck(ctx: KoaContext<object, IHealthResponse>) {
  ctx.body = await HealthService.getHealthCheckResponse();
}
