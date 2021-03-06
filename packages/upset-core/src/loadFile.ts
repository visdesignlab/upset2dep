import axios from 'axios';

import { Sets, SetCombination } from 'Types/Model';
import { getExclusiveIntersections } from './Proc/getExclusiveIntersections';
import { getSets } from './Proc/getSets';
import { DataJSONSpec, getData, parseJSONSpec, DataRow } from './Types/Data';
import { datasetPath } from '.';

export async function loadFromJSON(
  url: string
): Promise<{ sets: Sets<DataRow>; intersections: SetCombination<DataRow>[] }> {
  const raw = await axios.get(url);
  const jsonSpec: DataJSONSpec = parseJSONSpec(raw.data);
  const rawData = await axios.get(jsonSpec.file);
  const data = getData(rawData.data, jsonSpec);
  const sets = getSets(data);
  const intersections = getExclusiveIntersections(sets, data);

  return { sets, intersections };
}

export async function getAllDatasets() {
  const datasetPromise = await axios.get(`${datasetPath}/datasets.json`);
  const datasets: string[] = datasetPromise.data;

  return datasets.map((data) => `${datasetPath}/${data}`);
}
