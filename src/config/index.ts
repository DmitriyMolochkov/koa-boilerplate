import { plainToClass } from 'class-transformer';
import nodeConfig from 'config';

import ApplicationConfig from './ApplicationConfig';

export { ApplicationConfig };

const configModel: ApplicationConfig = nodeConfig.get('config');
const applicationConfig = plainToClass(ApplicationConfig, configModel);

export default applicationConfig;
