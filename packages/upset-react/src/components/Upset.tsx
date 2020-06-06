import React, { useEffect, useState } from 'react';
import { UpsetData, defaultUpsetConfig } from 'upset-core';
import CssBaseline from '@material-ui/core/CssBaseline';
import WebFont from 'webfontloader';
import { styled } from '@material-ui/core';
import { Provider } from 'mobx-react';
import { UpsetStore } from '../store/UpsetStore';
import ConfigurationBar from './configuration/ConfigurationBar';
import Visualization from './Visualization';

type UpsetProps = {
  datasource: string | null;
};

function useRoboto() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto'],
      },
    });
  }, []);
}

export function Upset({ datasource }: UpsetProps) {
  // Hook for use robot font.
  useRoboto();

  const [store, setStore] = useState<UpsetStore | null>(null);

  useEffect(() => {
    if (datasource) {
      const newStore = UpsetStore.fromDatasourceAndConfig(
        datasource,
        defaultUpsetConfig
      );
      setStore(newStore);
    }
  }, [datasource]);

  if (!store) return <div>No datasource specified</div>;

  return (
    <>
      <CssBaseline />
      <UpsetStyle>
        <Provider store={store}>
          <ConfigurationBar />
          <Visualization />
        </Provider>
      </UpsetStyle>
    </>
  );
}

const UpsetStyle = styled('div')({
  // Set Upset to take 100% width and  height of the parent. Change this to make it customizable.
  height: '100%',
  width: '100%',

  // For debugging. Remove
  border: '1px solid red',

  // Set font to Roboto which is loaded as part of MaterialUI. Test if making this customizable breaks Material UI
  fontFamily: 'Roboto:300,400,500,700',
});
