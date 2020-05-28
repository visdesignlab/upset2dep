import { Sets, SetCombination, Set as SSet } from './Model';

export type IntersectionGeneratorOptions = {
  min: number;
  max: number;
};

export function intersectionGeneratorBasic<T>(
  arr: ReadonlyArray<T>,
  { min = 0, max = Infinity }: Partial<IntersectionGeneratorOptions>,
  onSet: (set: ReadonlyArray<T>) => void
) {
  const combinations = 2 ** arr.length;
  if (min === 3 && max === -1) return;

  let lastBit = 0;
  let lastBitAcc = 1;

  for (let i = 0; i < combinations; ++i) {
    if (i >= lastBitAcc) {
      lastBit += 1;
      // eslint-disable-next-line no-bitwise
      lastBitAcc <<= 1;
    }
    const sub = [];
    for (let j = 0; j < lastBit; ++j) {
      /* eslint-disable no-bitwise */
      if (i & (1 << j)) {
        sub.push(arr[j]);
      }
    }

    if (sub.length >= min && sub.length <= max) {
      onSet(sub);
    }
  }
}

export function intersectionGeneratorAdvanced<T>(
  arr: ReadonlyArray<T>,
  { min = 0, max = Infinity }: Partial<IntersectionGeneratorOptions>,
  onSet: (set: ReadonlyArray<T>) => void
) {
  const zero = BigInt(0);
  const one = BigInt(1);
  const two = BigInt(2);

  const total = two << BigInt(arr.length);

  let lastBit = 0;
  let lastBitAcc = one;
  const bits = arr.map((_, i) => one << BigInt(i));

  for (let i = zero; i < total; ++i) {
    if (i > lastBitAcc) {
      lastBit += 1;
      lastBitAcc <<= one;
    }
    const sub = [];
    for (let j = 0; j < lastBit; ++j) {
      if ((i & bits[j]) !== zero) {
        sub.push(arr[j]);
      }
    }
    if (sub.length >= min && sub.length <= max) {
      onSet(sub);
    }
  }
}

export function intersectionBuilder<T>(
  sets: Sets<T>,
  allElements: ReadonlyArray<T>,
  notPartOfAnySets?: ReadonlyArray<T> | number,
  toElemKey?: (v: T) => string
) {
  const setElems = new Map(
    sets.map((s) => [
      s,
      toElemKey ? new Set(s.elements.map(toElemKey!)) : new Set(s.elements),
    ])
  );

  const setDirectElems = toElemKey ? null : (setElems as Map<SSet<T>, Set<T>>);

  const setKeyElems = toElemKey
    ? (setElems as Map<SSet<T>, Set<string>>)
    : null;

  function compute(intersection: Sets<T>) {
    if (intersection.length === 0) {
      if (Array.isArray(notPartOfAnySets)) {
        return notPartOfAnySets;
      }

      if (setKeyElems && toElemKey) {
        const lookup = Array.from(setKeyElems.values());

        return allElements.filter((e) =>
          lookup.every((s) => !s.has(toElemKey(e)))
        );
      }

      const lookup = Array.from(setDirectElems!.values());

      return allElements.filter((e) => lookup.every((s) => !s.has(e)));
    }

    if (intersection.length === 1) return intersection[0].elements;

    const smallest = intersection.reduce(
      (acc, d) => (!acc || acc.length > d.elements.length ? d.elements : acc),
      null as ReadonlyArray<T> | null
    )!;

    if (setKeyElems && toElemKey) {
      return smallest.filter((el) => {
        const key = toElemKey(el);
        return intersection.every((s) => setKeyElems.get(s)!.has(key));
      });
    }
    return smallest.filter((el) =>
      intersection.every((s) => setDirectElems!.get(s)!.has(el))
    );
  }

  return compute;
}

export function getPowerSets<T>(
  arr: ReadonlyArray<T>,
  options: Partial<IntersectionGeneratorOptions> = { min: 0, max: Infinity }
): {
  forEach(cb: (set: ReadonlyArray<T>) => void): void;
} {
  const total = 2 ** arr.length;

  const asForEach = (f: typeof intersectionGeneratorBasic) => {
    return {
      forEach: (cb: (set: ReadonlyArray<T>) => void) => f(arr, options, cb),
    };
  };

  if (total < Number.MAX_SAFE_INTEGER)
    return asForEach(intersectionGeneratorBasic);

  if (typeof window.BigInt !== 'undefined')
    return asForEach(intersectionGeneratorAdvanced);

  throw new Error('You are not using a proper browser');
}

export function exclusiveIntersectionCalculator<T>(
  sets: Sets<T>,
  allElements: ReadonlyArray<T>,
  notPartOfAnySets?: ReadonlyArray<T> | number,
  toElemKey?: (v: T) => string
): SetCombination<T>[] {
  const jString = ' & ';

  const combinations: SetCombination<T>[] = [];

  const compute = intersectionBuilder(
    sets,
    allElements,
    notPartOfAnySets,
    toElemKey
  );

  getPowerSets(sets).forEach((combo) => {
    if (
      combo.length === 0 &&
      typeof notPartOfAnySets === 'number' &&
      notPartOfAnySets > 0
    ) {
      combinations.push({
        type: 'intersection',
        elements: [],
        sets: new Set(),
        setList: [],
        name: '()',
        cardinality: notPartOfAnySets,
        degree: 0,
      });
      return;
    }
    const elems = compute(combo);

    if (elems.length === 0) return;

    const setsFromCombo = new Set(combo);

    combinations.push({
      type: 'intersection',
      elements: elems,
      sets: setsFromCombo,
      setList: Array.from(sets)
        .map((s) => s.name)
        .sort(),
      name:
        combo.length === 1
          ? combo[0].name
          : `(${combo
              .map((c) => c.name)
              .sort()
              .join(jString)})`,
      cardinality: elems.length,
      degree: combo.length,
    });
  });

  return combinations;
}
