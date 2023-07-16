import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class IdParam {
  @IsInt()
  @Type(() => Number)
  public id!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
