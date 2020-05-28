import { exclusiveIntersectionCalculator } from '../Types/exclusiveIntersections';
import { Sets } from '../Types/Model';
import { Data } from '../Types/Data';

export function getExclusiveIntersections<T>(sets: Sets<T>, data: Data) {
  return exclusiveIntersectionCalculator(
    sets,
    (data as unknown) as ReadonlyArray<T>
  );
}
