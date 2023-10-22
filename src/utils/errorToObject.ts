function jsonFriendlyErrorReplacer(key: string, value: unknown) {
  if (value instanceof Error) {
    return {
      ...value,
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  return value;
}

export function errorToObject(error: unknown): unknown {
  return JSON.parse(
    JSON.stringify(error, jsonFriendlyErrorReplacer),
  );
}
