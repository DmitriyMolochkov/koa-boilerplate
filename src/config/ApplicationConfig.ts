import { Type } from 'class-transformer';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';

import { Environment } from '#constants';

import { DbConfig, RedisConfig, ServerConfig } from './parts';

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

  @IsObject()
  @ValidateNested()
  @Type(() => RedisConfig)
  public readonly redisConfig!: RedisConfig;

  public get isProduction() {
    return this.nodeEnv === Environment.production;
  }
}
