import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { castArray } from 'lodash-es';

import { IsTrimmedString } from '#class-validator';
import { BaseQuery } from '#modules/common/models';
import { NoteStatus } from '#modules/notes/enums';

export class NoteQuery extends BaseQuery {
  @IsOptional()
  @IsTrimmedString()
  readonly searchString?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(NoteStatus, {
    each: true,
  })
  @Transform(({ value }: { value: NoteStatus | NoteStatus[] }) => castArray(value))
  readonly statuses?: NoteStatus[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public endDate?: Date;
}
