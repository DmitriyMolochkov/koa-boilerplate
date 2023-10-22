import { BaseMessage } from './BaseMessage';

export class RedisMessage<Msg extends BaseMessage> {
  public id: string;
  public version: Msg['version'];
  public payload: Msg['payload'];
  public createDateTime: Date;

  constructor({
    messageId,
    version,
    rawPayload,
    createDateTimeStr,
  }: {
    messageId: string;
    version: string;
    rawPayload: string;
    createDateTimeStr: string;
  }) {
    this.id = messageId;
    this.version = version;
    this.payload = JSON.parse(rawPayload) as Msg['payload'];
    this.createDateTime = new Date(createDateTimeStr);
  }
}
