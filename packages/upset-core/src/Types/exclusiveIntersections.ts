import { Sets, SetIntersection } from './Model';
import { DataRow } from './Data';

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

function setUpBitMaskGenerator(superArr: string[]) {
  const cacheKeyJoiner = '|-|-|';
  const cache: { [key: string]: string } = {
    notPartOfAnySet: superArr.map((_) => 0).join(''),
  };

  function getBitMaskLikeString(subsetArrUnfixed: string[]): string {
    const subsetArr = subsetArrUnfixed.filter((s) => superArr.includes(s));
    if (subsetArr.length > superArr.length)
      throw new Error('subset array cannot be longer than super array');

    if (subsetArr.length === 0) return cache.notPartOfAnySet;

    const cacheKey = subsetArr.join(cacheKeyJoiner);

    const cachedValue = cache[cacheKey];
    if (cachedValue) return cachedValue;

    const bitMask = superArr
      .map((superVal) => (subsetArr.includes(superVal) ? 1 : 0))
      .join('');

    cache[cacheKey] = bitMask;

    return bitMask;
  }

  return getBitMaskLikeString;
}

export function intersectionBuilder<T>(
  sets: Sets<T>,
  allElements: ReadonlyArray<T>
) {
  const getBitMaskLikeString = setUpBitMaskGenerator(sets.map((s) => s.name));

  const subsetElementRecord: { [key: string]: Array<T> } = {};

  allElements.forEach((el) => {
    const element = (el as unknown) as DataRow;
    const bitMask = getBitMaskLikeString(element.sets);

    if (!subsetElementRecord[bitMask]) subsetElementRecord[bitMask] = [];

    subsetElementRecord[bitMask].push(el);
  });

  function compute(intersection: Sets<T>): ReadonlyArray<T> {
    const bitMask = getBitMaskLikeString(intersection.map((s) => s.name));

    const record = subsetElementRecord[bitMask];

    return record || [];
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
  allElements: ReadonlyArray<T>
): SetIntersection<T>[] {
  console.clear();

  const jString = ' & ';

  const combinations: SetIntersection<T>[] = [];

  const compute = intersectionBuilder(sets, allElements);

  getPowerSets(sets).forEach((combo) => {
    const elements = compute(combo);

    if (combo.length === 0) {
      combinations.push({
        type: 'intersection',
        elements,
        sets: new Set(),
        setList: [],
        name: '()',
        cardinality: elements.length,
        degree: 0,
      });
    } else {
      combinations.push({
        type: 'intersection',
        elements,
        sets: new Set(combo),
        setList: combo.map((s) => s.name).sort(),
        name:
          combo.length === 1
            ? combo[0].name
            : `(${combo
                .map((c) => c.name)
                .sort()
                .join(jString)})`,
        cardinality: elements.length,
        degree: combo.length,
      });
    }
  });

  return combinations;
}
