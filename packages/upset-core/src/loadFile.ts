import axios from 'axios';

import { getExclusiveIntersections } from './Proc/getExclusiveIntersections';
import { getSets } from './Proc/getSets';
import { Data, DataJSONSpec, getData, parseJSONSpec } from './Types/Data';

export async function loadFromJSON(url: string): Promise<Data | null> {
  const raw = await axios.get(url);
  const jsonSpec: DataJSONSpec = parseJSONSpec(raw.data);
  const rawData = await axios.get(jsonSpec.file);
  const data = getData(rawData.data, jsonSpec);
  const sets = getSets(data);
  const intersections = getExclusiveIntersections(sets, data);

  console.log(intersections.filter((d) => d.degree === 4));

  return null;
}

export function loadMovies() {
  loadFromJSON(
    'https://raw.githubusercontent.com/visdesignlab/upset2/master/data/movies/movies.json'
  );
}
