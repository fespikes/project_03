
export class BPMSTaskDetail {
  id?: string; // 申请单号
  type?: string; // 申请类型 = ['QUOTA_APPLY', 'PROJECT_APPLY']
  typeAlias?: string; // 申请类型显示名称
  content?: object; // 申请内容 ,
  requester?: string; // 申请人 ,
  resources?: SysResource[];
  status?: string; // 申请状态 ['PENDING', 'REJECTED', 'APPROVAL']
  statusAlias?: string; // 申请状态显示
  startTime?: string; // 申请时间

  assignee?: string; // 审批人
  name?: string; // 申请名称
  executions?: Array<ApproverExecution>;
}

export enum applyType {
  QUOTA_APPLY = 'QUOTA_APPLY',
  PROJECT_APPLY = 'PROJECT_APPLY'
}

export class ApproverExecution {
  assignee?: string;
  name?: string;
  order?: number;
  procedureInstanceId?: string;
  status?: string; // ['PENDING', 'APPROVED', 'REJECTED'],
  type?: string; // ['QUOTA_APPLY', 'PROJECT_APPLY']
}

export class SysResource {
  allocatable?: number; // 总量 ,
  allocated?: number; // 分配使用量 ,
  name?: string; // 资源名称 ,
  unit?: string; // 资源单位 ,
  used?: number; // 实际使用量
}

export class TasksFilter {
  keyword?: string;
  type?: string;
  option?: string;  // ACTIVE(default)/ HISTORY
  page?: number;
  size?: number;
  status?: string;
}
