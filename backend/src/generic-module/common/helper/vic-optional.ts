import { ValueIsNotPresentInOptional } from '../../exception/business-exceptions/value-is-not-present-in-optional-exception';

export class Optional<T> {
  private _ = require('lodash');

  private value: T | null;

  constructor(value: T | null) {
    this.value = value;
  }

  static EMPTY<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  static of<U>(value: U): Optional<U> {
    return new Optional<U>(value);
  }

  isPresent(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  get(objectType?: string, objectId?: string): T {
    if (!this.isPresent()) {
      throw new ValueIsNotPresentInOptional(objectType, objectId);
    }
    return this.value!;
  }

  filter(predicate: (value: T) => boolean): Optional<T> {
    if (!this.isPresent()) {
      return this;
    }
    return predicate(this.value!) ? this : Optional.EMPTY<T>();
  }

  map<U>(mapper: (value: T) => U): Optional<U> {
    if (!this.isPresent()) {
      return Optional.EMPTY<U>();
    }
    return Optional.of<U>(mapper(this.value!));
  }

  flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (!this.isPresent()) {
      return Optional.EMPTY<U>();
    }
    const mapped = mapper(this.value!);
    if (mapped.isPresent()) {
      return mapped;
    } else {
      throw new Error(
        'flatMap should map the value to a non-null and non-undefined Optional.',
      );
    }
  }

  orElse(other: T): T {
    return this.isPresent() ? this.value! : other;
  }
}

function isNil(value: any): boolean {
  return value === null || value === undefined;
}
