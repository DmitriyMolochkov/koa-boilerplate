export function ViewMixin<TBase extends Constructor>(Base: TBase) {
  return class ExtendView extends Base {
    static fromArray(entities: ConstructorParameters<typeof Base>[0][]) {
      return entities.map((e) => (new ExtendView(e)) as InstanceType<typeof ExtendView>);
    }
  };
}
