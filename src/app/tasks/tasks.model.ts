export class TaskFilter {
  page?: number;
  size?: number;
  deleted? = false;
  status?: string;
  keyword?: string;
}


export enum status {
  pending = 'PENDING',
  running = 'RUNNING',
  failure = 'FAILED',
  succeed = 'PASSED',
  deleted = 'DELETED',
  terminating = 'TERMINATING',
  all = 'ALL',
};
