
export class NodeFilter {

  page: number;
  size: number;

  coreNum: number;

  status: string;
  /* brokenCount / healthyCount / riskyCount */

  newJoined: any;
  
  freeCount: 0;    //

  reset(filter?) {
    this.page = 0;
    this.size = 10;

    filter&&filter.coreNum? this.coreNum=filter.coreNum : delete this.coreNum;
    filter&&filter.status? this.status=filter.status : delete this.status;
    filter&&filter.status? this.status=filter.status : delete this.status;
    filter&&filter.newJoined? this.newJoined=filter.newJoined : delete this.newJoined ;
    filter&&filter.freeCount? this.freeCount=filter.freeCount : delete this.freeCount;
  }
}

export class NodeListSummary {

  addedCount: number;
  brokenCount: number;
  healthyCount: number;
  riskyCount: number;

  coreOptions: Array<number>
  
  freeCount: number;  //
}
