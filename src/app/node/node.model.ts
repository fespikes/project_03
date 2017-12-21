
export class NodeFilter {
  page?: number;
  size?: number;
  coreNum?: number;
  status?: string; // options: brokenCount healthyCount riskyCount
  newJoined?: any;
  freeCount?: number;
}

export class NodeListSummary {

  addedCount: number;
  brokenCount: number;
  healthyCount: number;
  riskyCount: number;

  coreOptions: Array<number>;

  freeCount: number;  //
}
