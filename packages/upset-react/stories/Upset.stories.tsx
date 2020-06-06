import React, { useState, useEffect } from 'react';
import { getAllDatasets } from 'upset-core';
import { withKnobs, select } from '@storybook/addon-knobs';
import { Upset } from '../src';
import 'mobx-react/batchingForReactDom';

export default {
  title: 'Upset Component 2',
  decorators: [withKnobs],
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const ReactComponent = () => {
  const [datasetList, setDatasetList] = useState<string[]>(['Null']);
  const [data, setData] = useState<string | null>(null);
  const selectedString = select('Dataset', datasetList, 'Null');

  useEffect(() => {
    getAllDatasets().then((datasetListt) => {
      setDatasetList((d) => [...d, ...datasetListt]);
    });
  }, []);

  useEffect(() => {
    if (selectedString === null || selectedString === 'Null') return;
    setData(selectedString);
  }, [selectedString]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Upset datasource={data} />
    </div>
  );
};
