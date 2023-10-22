export function* keyValuePairs(redisValues: string []) {
  for (let i = 0; i < redisValues.length; i += 2) {
    const key = redisValues[i];
    const value = redisValues[i + 1];

    if (key === undefined) {
      throw new Error('Impossible exception: key is undefined');
    }
    if (value === undefined) {
      throw new Error('Impossible exception: value is undefined');
    }

    yield [key, value];
  }
}
