import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import nodeConfig from 'config';

import ApplicationConfig from './ApplicationConfig';

export { ApplicationConfig };
export * from './parts';

const configModel: ApplicationConfig = nodeConfig.get('config');
const applicationConfig = plainToClass(ApplicationConfig, configModel);
const errors = await validate(applicationConfig, {
  whitelist: true,
  forbidNonWhitelisted: true,
});
if (errors.length > 0) {
  throw new Error(`\n${errors.map((e) => e.toString(true, undefined, undefined, true)).join('')}`);
}

export default applicationConfig;
export const {
  serverConfig,
  dbConfig,
} = applicationConfig;
