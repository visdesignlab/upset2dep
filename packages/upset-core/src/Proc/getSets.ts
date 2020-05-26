import { DataRow } from '../Types/Data';
import { Set, Sets } from '../Types/Model';

export function getSets<T>(
  data: ReadonlyArray<T>,
  accessor = (e: T) => ((e as unknown) as DataRow).sets
): Sets<T> {
  const sets = new Map<string, T[]>();

  data.forEach((el) => {
    accessor(el).forEach((set) => {
      if (!sets.has(set)) sets.set(set, [el]);
      else sets.get(set)?.push(el);
    });
  });

  const arr: Sets<T> = Array.from(sets).map(([set, elements]) => {
    const setRep: Set<T> = {
      type: 'set',
      elements,
      name: set,
      cardinality: elements.length,
    };

    return setRep;
  });

  return arr;
}
