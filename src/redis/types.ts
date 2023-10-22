export type EntryId = string;
export type StreamKey = string;
export type RawRedisMessage = [EntryId, string[]];
export type StreamRawRedisMessage = [StreamKey, RawRedisMessage[]];
export type ParsedRedisMessage = [EntryId, Record<string, string>];
export type StreamRedisMessage = [StreamKey, ParsedRedisMessage[]];
