import {
  IsBoolean, IsOptional, Length, ValidateNested,
} from '#class-validator';

import Author from './Author.spec-helper';

export default class Post {
  @IsOptional()
  @ValidateNested()
  public author!: Author;

  @Length(2, 100)
  @IsOptional()
  public title!: string;

  @IsBoolean()
  @IsOptional()
  public published!: true;
}
