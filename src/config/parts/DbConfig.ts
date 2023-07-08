import { IsString } from 'class-validator';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { IsPort } from '#class-validator';

export default class DbConfig {
  @IsString()
  public readonly type!: PostgresConnectionOptions['type'];

  @IsString()
  public readonly host!: string;

  @IsPort()
  public readonly port!: number;

  @IsString()
  public readonly username!: string;

  @IsString()
  public readonly password!: string;

  @IsString()
  public readonly database!: string;
}
