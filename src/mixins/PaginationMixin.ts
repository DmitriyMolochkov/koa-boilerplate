import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { FindManyOptions } from 'typeorm';

export function PaginationMixin<TBase extends Constructor>(Base: TBase) {
  class PaginationModel extends Base {
    @IsInt()
    @Min(0)
    @Type(() => Number)
    public offset!: number;

    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    public limit!: number;

    get ormOpts(): Required<Pick<FindManyOptions, 'skip' | 'take'>> {
      return {
        skip: this.offset,
        take: this.limit,
      };
    }
  }

  return PaginationModel;
}
