import React, { FC, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';

export type ConfigurationBarProps = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
    },
    formControlAgg: {
      minWidth: 160,
    },
    formControlSort: {
      minWidth: 120,
    },
    slider: {
      width: 150,
      margin: theme.spacing(1),
    },
    overlap: {
      width: 50,
    },
  })
);

const ConfigurationBar: FC<ConfigurationBarProps> = ({}: ConfigurationBarProps) => {
  const {
    formControl,
    overlap,
    formControlSort,
    formControlAgg,
    slider,
  } = useStyles();

  const [sliderSelectedRange, setSliderSelectedRange] = useState([3, 5]);

  // Components
  const firstAggregateBy = (
    <FormControl className={clsx(formControl, formControlAgg)}>
      <InputLabel id="first-agg-by">First Aggregate By</InputLabel>
      <Select labelId="first-agg-by">
        <MenuItem value="Degree">Degree</MenuItem>
        <MenuItem value="Sets">Sets</MenuItem>
        <MenuItem value="Deviation">Deviation</MenuItem>
        <MenuItem value="Overlaps">Overlaps</MenuItem>
        <MenuItem value="None">None</MenuItem>
      </Select>
    </FormControl>
  );

  const firstOverlapValue = (
    <TextField
      id="first-overlap"
      label="Degree"
      type="number"
      className={overlap}
      value={0}
    />
  );

  const secondAggregateBy = (
    <FormControl className={clsx(formControl, formControlAgg)}>
      <InputLabel id="second-agg-by">Then Aggregate By</InputLabel>
      <Select labelId="second-agg-by">
        <MenuItem value="Degree">Degree</MenuItem>
        <MenuItem value="Sets">Sets</MenuItem>
        <MenuItem value="Deviation">Deviation</MenuItem>
        <MenuItem value="Overlaps">Overlaps</MenuItem>
        <MenuItem value="None">None</MenuItem>
      </Select>
    </FormControl>
  );

  const secondOverlapValue = (
    <TextField
      id="second-overlap"
      label="Degree"
      type="number"
      className={overlap}
      value={0}
    />
  );

  const sortBy = (
    <FormControl className={clsx(formControl, formControlSort)}>
      <InputLabel id="sort-by">Sort By</InputLabel>
      <Select labelId="sort-by">
        <MenuItem value="Degree">Degree</MenuItem>
        <MenuItem value="Cardinality">Cardinality</MenuItem>
        <MenuItem value="Deviation">Deviation</MenuItem>
      </Select>
    </FormControl>
  );

  const degreeSlider = (
    <FormControl className={clsx(formControl, slider)}>
      <Typography id="degree-slider" gutterBottom>
        Degree [{sliderSelectedRange[0]} to {sliderSelectedRange[1]}]
      </Typography>
      <Slider
        min={0}
        max={10}
        value={sliderSelectedRange}
        valueLabelDisplay="auto"
        onChange={(_: unknown, newValue: number | number[]) => {
          if (!Array.isArray(newValue) || newValue.length !== 2)
            throw new Error('Something went wrong in degree slider');
          if (newValue[0] !== newValue[1]) setSliderSelectedRange(newValue);
        }}
      />
    </FormControl>
  );

  const hideEmptySwitch = (
    <FormControlLabel
      control={<Switch checked={true} color="primary" />}
      label="Hide Empty Intersections"
    />
  );

  return (
    <>
      <AppBar position="static" color="transparent">
        <Toolbar>
          {firstAggregateBy}
          {firstOverlapValue}
          {secondAggregateBy}
          {secondOverlapValue}
          {sortBy}
          {degreeSlider}
          {hideEmptySwitch}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default ConfigurationBar;
