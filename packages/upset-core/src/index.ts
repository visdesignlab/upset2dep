import { getAllDatasets } from './loadFile';

export { getAllDatasets };

export const datasetPath =
  'https://raw.githubusercontent.com/visdesignlab/upset2dep/master/datasets';

getAllDatasets().then((d) => console.log(d));

/*
loadMovies();
*/
