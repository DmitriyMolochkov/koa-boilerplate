import { IsString } from 'class-validator';

import { IsPort } from '#class-validator';

export class ServerConfig {
  @IsPort()
  public readonly port!: number;

  @IsString()
  public readonly domain!: string;
}
