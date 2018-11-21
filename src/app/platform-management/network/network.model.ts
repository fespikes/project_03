
export class Filter {
  page?: number;
  size?: number;
  coreNum?: number;
  filter?: string;
  tenantUid?: string;
}

export class XNetwork {
  cidr?: string;
  createTime?: string; // 创建时间
  created_at?: string; //
  created_by?: string; //
  creator?: string; // 创建者
  description?: string; // 描述
  gateway?: string; //
  name?: string; // 网络名称
}

export class XSecurityRule {
  address?: string;
  cidr?: string; // cidr
  description?: string; // 规则描述
  networkName?: string; // 关联网络名称
  policy?: string; // 授权策略 = ['ACCEPT', 'REJECT'],
  port?: number; // 端口
  protocol?: string; // 协议类型
}
