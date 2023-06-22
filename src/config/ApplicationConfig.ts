import { Type } from 'class-transformer';

import { IsObject, ValidateNested } from '#class-validator';

import DbConfig from './parts/DbConfig';
import ServerConfig from './parts/ServerConfig';

export default class ApplicationConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => ServerConfig)
  public readonly serverConfig!: ServerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => DbConfig)
  public readonly dbConfig!: DbConfig;
}
