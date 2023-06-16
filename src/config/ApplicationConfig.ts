import DbConfig from './parts/DbConfig';
import ServerConfig from './parts/ServerConfig';

export default class ApplicationConfig {
  public readonly systemConfig!: ServerConfig;
  public readonly dbConfig!: DbConfig;
}
