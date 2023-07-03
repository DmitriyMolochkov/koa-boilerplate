import { IsString } from 'class-validator';

import { IsPort } from '#class-validator';

export default class ServerConfig {
  @IsPort()
  public readonly port!: number;

  @IsString()
  public readonly domain!: string;
}
