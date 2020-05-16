import Button from '@material-ui/core/Button';
import React, { FC, useState } from 'react';

export type UpsetProps = {
  name?: string;
};

const Upset: FC<UpsetProps> = ({ name = "Test" }: UpsetProps) => {
  const [n, setN] = useState(() => name);
  return (
    <div>
      <div>Upset {n}</div>
      <Button onClick={() => setN(`${Math.random()}`)}>Change</Button>
    </div>
  );
};

export default Upset;
