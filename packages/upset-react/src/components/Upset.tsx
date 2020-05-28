import React, { FC, useState, useEffect } from 'react';
import { loadMovies } from 'upset-core';

type UpsetProps = {};

export const Upset: FC<UpsetProps> = ({}: UpsetProps) => {
  const [temp, setTemp] = useState<unknown>(null);

  useEffect(() => {
    loadMovies().then(({ sets, intersections }) => {
      setTemp({ sets, intersections });
    });
  }, []);

  return (
    <div>{temp && `${temp.sets.length}  ${temp.intersections.length}`}</div>
  );
};
