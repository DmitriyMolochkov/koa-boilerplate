import {
  Allow,
  ArrayMaxSize,
  ArrayNotContains,
  IsEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from '#class-validator';

export default class Author {
  @IsString() id!: string;
  @MinLength(5)
  public firstName!: string;

  @IsOptional()
  @MaxLength(20, { each: true })
  @ArrayMaxSize(5)
  @ArrayNotContains(['admin'])
  public tags!: string[];

  @IsEmpty() empty!: string;
  @IsObject() object!: object;
  @IsNotEmptyObject()
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/ban-types
  public nonEmptyObject!: {};

  @Allow()
  public any: unknown;
}
