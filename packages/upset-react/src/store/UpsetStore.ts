import { observable, action, reaction, toJS, computed } from 'mobx';

import {
  UpsetData,
  DataRow,
  UpsetConfig,
  SetIntersection,
  getExclusiveIntersections,
  loadFromJSON,
  defaultUpsetConfig,
  processIntersections,
  Sets,
  Set,
  Data,
} from 'upset-core';
import { Provenance, initProvenance } from '@visdesignlab/provenance-lib-core';

export type UpsetState = {
  datasource: string;
  config: UpsetConfig;
};

export class UpsetStore {
  // To create store instance from original constructor
  static fromDatasourceAndConfig(datasource: string, config: UpsetConfig) {
    return new this(datasource, config);
  }

  // To create store from provenance state
  static fromProvenanceState(state: UpsetState) {
    return new this(state.datasource, state.config);
  }

  id: string;

  defaultVisibleSets: number = 5;

  @observable provenance: Provenance<UpsetState, unknown, unknown>;

  @observable data: UpsetData<DataRow> = { raw: [], sets: [] };

  @observable config: UpsetConfig = defaultUpsetConfig;

  @observable intersections: SetIntersection<DataRow>[] = [];

  @observable visibleSetList: string[] = [];

  @observable hiddenSetList: string[] = [];

  @observable renderRows: SetIntersection<DataRow>[] = [];

  constructor(datasource: string, config: UpsetConfig) {
    this.id = Math.random().toFixed(10);
    this.provenance = initProvenance({
      datasource,
      config,
    });

    reaction(
      () => this.config,
      () => this.processIntersections()
    );

    reaction(
      () => this.visibleSetList,
      () => this.generateIntersections()
    );

    loadFromJSON(datasource).then((data) => {
      this.data = data;
      if (this.data.sets.length > this.defaultVisibleSets) {
        this.visibleSetList = this.data.sets
          .slice(0, this.defaultVisibleSets)
          .map((s) => s.name);
        this.hiddenSetList = this.allSets
          .filter((d) => !this.visibleSetList.includes(d.name))
          .map((s) => s.name);
      } else {
        this.visibleSetList = this.data.sets.map((s) => s.name);
        this.hiddenSetList = [];
      }
      this.generateIntersections(false);
      this.config = config;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @computed get visibleSets(): Sets<any> {
    return this.allSets.filter((s) => this.visibleSetList.includes(s.name));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @computed get allSets(): Sets<any> {
    return this.data.sets;
  }

  @computed get rawData(): Data {
    return this.data.raw;
  }

  @action
  setFromName<T>(name: string): Set<T> | undefined {
    const set = this.allSets.find((s) => s.name === name);
    return set;
  }

  @action
  generateIntersections(process: boolean = true) {
    this.intersections = getExclusiveIntersections(
      toJS(this.visibleSets),
      toJS(this.rawData)
    );
    if (process) this.processIntersections();
  }

  @action
  processIntersections() {
    this.renderRows = processIntersections(
      toJS(this.rawData),
      toJS(this.visibleSets),
      toJS(this.intersections),
      toJS(this.config)
    );
  }

  @action addSet<T>(set: Set<T>) {
    const setName = set.name;
    if (
      !this.visibleSetList.includes(setName) &&
      this.hiddenSetList.includes(setName)
    ) {
      this.visibleSetList = [...this.visibleSetList, setName];
      this.hiddenSetList = this.hiddenSetList.filter((d) => d !== setName);
    }
  }

  @action removeSet<T>(set: Set<T>) {
    const setName = set.name;
    if (
      this.visibleSetList.includes(setName) &&
      !this.hiddenSetList.includes(setName)
    ) {
      this.visibleSetList = this.visibleSetList.filter((s) => s !== set.name);
      this.hiddenSetList = [...this.hiddenSetList, setName];
    }
  }

  @action testAdd() {
    if (this.hiddenSetList.length === 0) return;
    const set = this.setFromName(this.hiddenSetList[0]);
    if (set) this.addSet(set);
  }

  @action testRemove() {
    if (this.visibleSetList.length > 0) this.removeSet(this.visibleSets[0]);
  }
}
