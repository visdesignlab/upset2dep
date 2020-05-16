import React, { FC } from 'react';

export type UpsetProps = {
  name?: string;
};

const Upset: FC<UpsetProps> = ({ name = "Test" }: UpsetProps) => {
  return <div>Upset {name}</div>;
};

export default Upset;
