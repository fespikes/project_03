
export class BPMSTaskDetail {
  id?: string; // 申请单号
  type?: string; // 申请类型 = ['QUOTA_APPLY', 'PROJECT_APPLY']
  content?: object; // 申请内容 ,
  requester?: string; // 申请人 ,
  resources?: SysResource[];
  stage?: string; // 申请的总体状态(eco只会出现PENDING_APPROVAL) = ['PENDING_APPROVAL', 'DEPLOYING', 'COMPLETED', 'REJECTED', 'CANCELLED'],
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

}
