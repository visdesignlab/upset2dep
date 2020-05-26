export type SetTypes = 'set' | 'intersection';

export type BaseSet<T> = {
  readonly name: string;
  readonly elements: ReadonlyArray<T>;
  readonly cardinality: number;
};

export type Set<T> = BaseSet<T> & {
  readonly type: 'set';
};

export type SetIntersection<T> = BaseSet<T> & {
  readonly type: 'intersection';
  readonly sets: ReadonlySet<Set<T>>;
  readonly degree: number;
};

// Possibly not needed
export type SetUnion<T> = SetIntersection<T> & {
  readonly type: 'union';
  readonly sets: ReadonlySet<Set<T>>;
  readonly degree: number;
};

export type SetComposite<T> = SetIntersection<T> & {
  readonly type: 'composite';
  readonly sets: ReadonlySet<Set<T>>;
  readonly degree: number;
};

export declare type SetCombination<T> =
  | SetIntersection<T>
  | SetUnion<T>
  | SetComposite<T>;

export declare type Sets<T> = ReadonlyArray<Set<T>>;

export declare type SetLike<T> = Set<T> | SetCombination<T>;

export declare type SetLikes<T> = ReadonlyArray<SetLike<T>>;

export function getKey(setLike: SetLike<unknown>): string {
  return `${setLike.name}:${setLike.type}#${setLike.cardinality}`;
}
