export abstract class BusinessError extends Error {
  public readonly entityId?: number;
  public readonly entityName?: string;

  protected constructor(
    entityName?: string,
    entityId?: number,
    message?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.entityName = entityName;
    this.entityId = entityId;
  }
}
