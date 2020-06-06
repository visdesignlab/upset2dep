import { dsvFormat, DSVParsedArray, DSVRowString } from 'd3-dsv';

export type DataRow = {
  id: string;
  sets: string[];
  attributes: { [key: string]: unknown };
};

export type Data = ReadonlyArray<DataRow>;

export type DataJSONSpec = {
  file: string;
  name: string;
  header: number;
  sep: string;
  skip: number;
  author: string;
  description: string;
  source: string;
  meta: ReadonlyArray<Metadata>;
  setInfo: ReadonlyArray<SetInfo>;
};

export type MetadataType = 'id' | 'integer' | 'float';

export type Metadata = {
  type: MetadataType;
  index: number;
  name: string;
  min?: number;
  max?: number;
};

export type SetDescriptionFormat = 'binary';

export type SetInfo = {
  format: SetDescriptionFormat;
  start: number;
  end: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJSONSpec(raw: any): DataJSONSpec {
  const baseUrl =
    'https://raw.githubusercontent.com/visdesignlab/upset2/master/';

  let sep = ',';
  if (Object.keys(raw).includes('sep')) sep = raw.sep;
  else if (Object.keys(raw).includes('seperator')) sep = raw.seperator;
  else if (Object.keys(raw).includes('separator')) sep = raw.separator;

  return {
    file: `${baseUrl}${raw.file}`,
    name: raw.name,
    header: raw.header,
    sep,
    skip: raw.skip,
    author: raw.author,
    description: raw.description,
    source: raw.source,
    meta: raw.meta,
    setInfo: raw.sets,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getData(rawData: any, spec: DataJSONSpec): Data {
  const parsedData: DSVParsedArray<DSVRowString> = dsvFormat(spec.sep).parse(
    rawData
  );

  const { columns = [] } = parsedData;

  const setColumns = getSetColumns(columns, spec.setInfo);
  const attrs = spec.meta.filter((d) => d.type !== 'id');
  const hasId = spec.meta.find((d) => d.type === 'id');

  const data: Data = parsedData.map((d: DSVRowString, i) => {
    const isMemberOf: string[] = setColumns.filter((c) => {
      const val = d[c];
      if (!val) return false;
      return parseInt(val, 10) > 0;
    });

    const attributes: { [key: string]: unknown } = {};

    attrs.forEach(({ name, type, index }) => {
      const rawVal = d[columns[index]];
      if (!rawVal) return;
      if (type === 'float') attributes[name] = parseFloat(rawVal);
      if (type === 'integer') attributes[name] = parseInt(rawVal, 10);
    });

    return {
      id: hasId ? d[columns[hasId.index]] || i.toString() : i.toString(),
      sets: isMemberOf.sort(),
      attributes,
    };
  });

  return data;
}

function getSetColumns(
  columns: string[],
  setInfo: ReadonlyArray<SetInfo>
): string[] {
  if (columns.length === 0) return columns;
  const setColumns: string[] = [];

  for (let i = 0; i < setInfo.length; ++i) {
    const { format, start, end } = setInfo[i];

    if (format === 'binary') {
      const setLength = end - start + 1;
      for (let s = 0; s < setLength; ++s) {
        setColumns.push(columns[start + s]);
      }
    } else {
      throw new Error(
        `Set definition format ${format} is not yet supported. Please file an issue with details and we may support it.`
      );
    }
  }

  return setColumns;
}
