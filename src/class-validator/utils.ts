import { MetadataStorage as SealedMetadataStorage, getMetadataStorage } from 'class-validator';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

export type MetadataStorage = {
  validationMetadatas: Map<Constructor | string, ValidationMetadata[]>;
  constraintMetadatas: Map<Constructor | string, ConstraintMetadata[]>;
} & Omit<SealedMetadataStorage, 'validationMetadatas' | 'constraintMetadatas'>;

export function patchMetadataStore(patchingFn: (store: MetadataStorage) => void) {
  const storage = getMetadataStorage() as unknown as MetadataStorage;
  patchingFn(storage);
}
