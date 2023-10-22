export abstract class BaseMessage<Type extends string = string> {
  public abstract readonly version: string;
  public abstract readonly payload: Record<string, unknown>;
  public readonly streamName: Type;
  public readonly createDateTime: Date;

  protected constructor(streamName: Type) {
    this.streamName = streamName;
    this.createDateTime = new Date();
  }
}
