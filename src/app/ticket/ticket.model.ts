
export class TicketFilter {
  page?: number;
  size?: number;
  isResolved = false;

  priority?: string;
  username?: string;
  queueId?: string;
  startTime?: string;
  endTime?: string;

  status?: string;
  ticketId?: string;
  statuses?: string;
  keywords?: string;
  sortedBy?: any;
  order?: any;
  types?: any;
}


export class ApplyInfo {
  constructor() { }

  applicant: string;
  connection: string;
  filters: object = {};
  schedule: string;
  tableInfo: any = {
    columns: [
      {
        name: '',
        type: '',
      },
    ],
    database: '',
    table: '',
  };
}

// TODO: ticket
export class Ticket {
  id: string;
  attachments: any[] = [];
  assignee?: string;
  createdTime?: string;
  description?: string;
  dueDate?: string;
  modifiedTime?: string;
  priority?: string;
  priorityAlias?: string;
  resolution?: string;
  scope?: string;
  serviceType?: string;
  status?: string;
  statusAlias?: string;
  submitter?: string;
  title?: string;
  serviceTypeAlias?: string;

  payload?: any = {
    applyInfo: new ApplyInfo(),
  };
  ticketChanges?: any[] = [];
  tenant?: any;
}

export enum Statuses {
  unresolved = 'UNRESOLVED',
  rejected = 'REJECTED',
  agreed = 'AGREED',
  // collect together
}

export class TicketChange {
  field?: string;    // 变化区域
  followUpId?: number;    // 编号
  followUpTitle?: string;  // 标题
  id?: string;   // 工单变化编号
  newValue?: string;    // 新值
  oldValue?: string;  // 旧值
  operateTime?: string;    // 操作时间
  operator: string;    // 操作者
  ticketId: string;      // 工单编号
}
