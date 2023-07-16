export class ViewByPage<T> {
  constructor(
    public data: T[],
    public total: number,
  ) {
  }
}
