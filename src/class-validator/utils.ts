import {
  MetadataStorage as DefaultMetadataStorage,
  getMetadataStorage as getDefaultMetadataStorage,
} from 'class-validator';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

type TargetIdentifier = Constructor | string;

export type MetadataStorage = {
  validationMetadatas: Map<TargetIdentifier, ValidationMetadata[]>;
  constraintMetadatas: Map<TargetIdentifier, ConstraintMetadata[]>;
} & Omit<DefaultMetadataStorage, 'validationMetadatas' | 'constraintMetadatas'>;

export const refPointerPrefix = '/schemas/';

export function getSchemaIdByTarget(target: TargetIdentifier) {
  return `${refPointerPrefix}${typeof target === 'string' ? target : target.name}`;
}

export function getMetadataStorage() {
  return getDefaultMetadataStorage() as unknown as MetadataStorage;
}

export function patchMetadataStore(patchingFn: (store: MetadataStorage) => void) {
  const storage = getMetadataStorage();
  patchingFn(storage);
}
