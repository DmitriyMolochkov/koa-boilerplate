import { IsOptional } from 'class-validator';

import { NoteUpdateModel } from '#modules/notes/models/NoteUpdateModel';

export class NotePatchModel extends NoteUpdateModel {
  @IsOptional()
  declare title: string;

  @IsOptional()
  declare description: string | null;

  @IsOptional()
  declare expirationDate: Date;

  @IsOptional()
  declare text: string;
}
