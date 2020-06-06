import React from 'react';
import { Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../store/UpsetStore';

type VisualizationProps = {
  store?: UpsetStore;
};

function Visualization({ store }: VisualizationProps) {
  const { visibleSetList } = store!;

  return (
    <>
      <Button
        onClick={() => {
          store!.testAdd();
        }}
      >
        Add
      </Button>
      <Button
        onClick={() => {
          store!.testRemove();
        }}
      >
        Remvoe
      </Button>
      <div>
        {visibleSetList.map((d) => (
          <div>{d}</div>
        ))}
      </div>
    </>
  );
}

export default inject('store')(observer(Visualization));
