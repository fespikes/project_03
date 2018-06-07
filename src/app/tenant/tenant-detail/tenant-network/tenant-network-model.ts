
export class Network {
  id?: string;
  cidr?: string;
  name?: string;
  gateway?: string;
  type?: string;
  description?: string;
  created_at?: string;
  created_by?: string;
}

// 授权策略
export const policies = [ 'ACCEPT', 'REJECT'];
// 协议类型
export const protocols = [ ' ', 'TCP', 'UDP'];
