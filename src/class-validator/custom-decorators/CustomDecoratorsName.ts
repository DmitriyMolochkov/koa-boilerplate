/* eslint @typescript-eslint/prefer-literal-enum-member: off */
import { IS_LOWERCASE, IS_PORT } from 'class-validator';

enum CustomDecoratorsName {
  IsNullable = 'isNullable',
  IsTrimmedString = 'isTrimmedString',
  IsLowercase = IS_LOWERCASE,
  IsPort = IS_PORT,
}

export default CustomDecoratorsName;
