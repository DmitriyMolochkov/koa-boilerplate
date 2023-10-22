export function encodeMessage(objectToStore: Record<string | symbol, unknown>) {
  const messageObject = Object.entries(objectToStore)
    .reduce<Record<string | symbol, string> >(
      (acc, [key, value]) => {
        if (value === undefined) {
          return acc;
        }
        acc[key] = typeof value === 'string' ? value : JSON.stringify(value);

        return acc;
      },
      {},
    );

  return messageObject;
}
