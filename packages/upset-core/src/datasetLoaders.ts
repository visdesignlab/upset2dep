import axios from 'axios';

import { getSets } from './Proc/getSets';
import { DataJSONSpec, getData, parseJSONSpec, DataRow } from './Types/Data';
import { UpsetData } from './Types/Model';

export const datasetPath =
  'https://raw.githubusercontent.com/visdesignlab/upset2dep/master/datasets';

export async function loadFromJSON(url: string): Promise<UpsetData<DataRow>> {
  const raw = await axios.get(url);
  const jsonSpec: DataJSONSpec = parseJSONSpec(raw.data);
  const rawData = await axios.get(jsonSpec.file);
  const data = getData(rawData.data, jsonSpec);
  const sets = getSets(data);

  return { raw: data, sets };
}

export async function getAllDatasets(): Promise<string[]> {
  const datasetPromise = await axios.get(`${datasetPath}/datasets.json`);
  const datasets: string[] = datasetPromise.data;

  return datasets.map((data) => `${datasetPath}/${data}`);
}
