import { IsPort, IsString } from '#class-validator';

export default class ServerConfig {
  @IsPort()
  public readonly port!: number;

  @IsString()
  public readonly domain!: string;
}
