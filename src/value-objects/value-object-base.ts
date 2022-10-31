import shallowEqual from 'shallowequal';

interface ValueObjectProp {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProp> {
  public readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }

    return shallowEqual(this.props, vo.props);
  }

  abstract toString(): string;
}