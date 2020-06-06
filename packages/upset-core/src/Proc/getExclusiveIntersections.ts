import { exclusiveIntersectionCalculator } from '../Types/exclusiveIntersections';
import { Sets, SetIntersection } from '../Types/Model';
import { Data } from '../Types/Data';
import { UpsetConfig, defaultUpsetConfig, SortOptions } from '../Types/config';

export function getExclusiveIntersections<T>(sets: Sets<T>, data: Data) {
  return exclusiveIntersectionCalculator(
    sets,
    (data as unknown) as ReadonlyArray<T>
  );
}

export function processIntersections<T>(
  data: Data,
  sets: Sets<T>,
  intersections: SetIntersection<T>[],
  config: Partial<UpsetConfig>
): SetIntersection<T>[] {
  const { minDegree, maxDegree, sortBy, hideEmptyIntersection } = {
    ...defaultUpsetConfig,
    ...config,
  };
  if (false) console.log(data, sets);

  const properDegreed = applyMinMaxDegree(intersections, minDegree, maxDegree);

  const emptyHidden = hideEmpty(
    properDegreed,
    hideEmptyIntersection === 'hide'
  );

  const sorted = sortIntersections(emptyHidden, sortBy);

  const processedIntersections = sorted;
  return processedIntersections;
}

function sortByDegree<T>(intersections: SetIntersection<T>[]) {
  const inter = intersections.sort((a, b) => a.degree - b.degree);
  return inter;
}

function sortByCardinality<T>(intersections: SetIntersection<T>[]) {
  const inter = intersections.sort((a, b) => a.cardinality - b.cardinality);
  return inter;
}

function getSortFunction(sortBy: SortOptions) {
  if (sortBy === 'Degree') return sortByDegree;
  return sortByCardinality;
}

export function sortIntersections<T>(
  intersections: SetIntersection<T>[],
  sortBy: SortOptions
) {
  const sort = getSortFunction(sortBy);

  return sort(intersections);
}

export function hideEmpty<T>(
  intersections: SetIntersection<T>[],
  hide: boolean = false
) {
  if (hide) return intersections.filter((i) => i.cardinality > 0);

  return intersections;
}

export function applyMinMaxDegree<T>(
  intersections: SetIntersection<T>[],
  min: number,
  max: number
): SetIntersection<T>[] {
  return intersections.filter(
    (exInt) => exInt.degree >= min && exInt.degree <= max
  );
}
