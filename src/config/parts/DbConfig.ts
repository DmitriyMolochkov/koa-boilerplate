import { IsString, Length } from 'class-validator';

export default class DbConfig {
  @IsString()
  @Length(5, 10)
  public readonly connectionString!: string;
}
