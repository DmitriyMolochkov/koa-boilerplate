export enum Environment {
  development = 'development',
  production = 'production',
}
export const ASCII_REG_EXP = /^[ -~]+$/g;
export const PASSWORD_REG_EXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;
export const TITLE_REG_EXP = /^[\p{L}\p{M}\p{N}\p{P}\p{Sm}\p{Sc}\p{Sk}\p{Zs}№]+$/gu;
export const TEXT_REG_EXP = /^[\p{L}\p{M}\p{N}\p{P}\p{S}\p{Z}\p{C}]+$/gu;
