export type AggregationOptions =
  | 'Degree'
  | 'Sets'
  | 'Deviation'
  | 'Overlap'
  | 'None';

export type SortOptions = 'Degree' | 'Cardinality' | 'Deviation';

export type HideEmptyOptions = 'hide' | 'show';

export type UpsetConfig = {
  firstAggregateBy: AggregationOptions;
  firstOverlapValue: number;
  secondAggregateBy: AggregationOptions;
  secondOverlapValue: number;
  sortBy: SortOptions;
  minDegree: number;
  maxDegree: number;
  hideEmptyIntersection: HideEmptyOptions;
};

export const defaultUpsetConfig: UpsetConfig = {
  firstAggregateBy: 'None',
  firstOverlapValue: 0,
  secondAggregateBy: 'None',
  secondOverlapValue: 0,
  sortBy: 'Degree',
  minDegree: 0,
  maxDegree: 7,
  hideEmptyIntersection: 'hide',
};
