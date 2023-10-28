export const TITLE_REG_EXP = /^[\p{L}\p{M}\p{N}\p{P}\p{Sm}\p{Sc}\p{Sk}\p{Zs}№]+$/gu;
export const TEXT_REG_EXP = /^[\p{L}\p{M}\p{N}\p{P}\p{S}\p{Z}\p{C}]+$/gu;
export const PASSWORD_REG_EXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 32;
