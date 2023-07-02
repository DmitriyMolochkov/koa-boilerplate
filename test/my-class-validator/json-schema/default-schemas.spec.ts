import { constructorToJsonSchema } from '#class-validator';

import { Author, Post } from '../models/index.spec-helper';

// You can find the source code of tests at: https://github.com/epiphone/class-validator-jsonschema/blob/4821a25a4224dd7c8f6e08fe2370235f9d8bf1f7/__tests__/index.test.ts
describe('constructorToJsonSchema', () => {
  it('combines converted a class-validator metadata for one object into JSON Schemas', () => {
    const postSchema = constructorToJsonSchema(Post);

    expect(postSchema).toEqual({
      $id: '/schemas/Post',
      additionalProperties: false,
      type: 'object',
      properties: {
        published: {
          type: 'boolean',
        },
        title: {
          maxLength: 100,
          minLength: 2,
          type: 'string',
        },
        author: {
          $ref: '/schemas/Author',
        },
      },
    });

    const userSchema = constructorToJsonSchema(Author);

    expect(userSchema).toEqual({
      $id: '/schemas/Author',
      additionalProperties: false,
      properties: {
        empty: {
          anyOf: [
            { type: 'string', enum: [''] },
            {
              not: {
                anyOf: [
                  { type: 'string' },
                  { type: 'number' },
                  { type: 'boolean' },
                  { type: 'integer' },
                  { type: 'array' },
                  { type: 'object' },
                ],
              },
              nullable: true,
            },
          ],
        },
        firstName: { minLength: 5, type: 'string' },
        id: { type: 'string' },
        object: { type: 'object' },
        nonEmptyObject: { type: 'object', minProperties: 1 },
        any: {},
        tags: {
          items: {
            maxLength: 20,
            not: {
              anyOf: [{ enum: ['admin'], type: 'string' }],
            },
            type: 'string',
          },
          maxItems: 5,
          type: 'array',
        },
      },
      required: ['id', 'firstName', 'object', 'any'],
      type: 'object',
    });
  });
});
