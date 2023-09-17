import { Type } from 'class-transformer';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';

import { Environment } from '#constants';

import { DbConfig, ServerConfig } from './parts';

export default class ApplicationConfig {
  @IsEnum(Environment)
  public readonly nodeEnv!: Environment;

  @IsObject()
  @ValidateNested()
  @Type(() => ServerConfig)
  public readonly serverConfig!: ServerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => DbConfig)
  public readonly dbConfig!: DbConfig;

  public get isProduction() {
    return this.nodeEnv === Environment.production;
  }
}
