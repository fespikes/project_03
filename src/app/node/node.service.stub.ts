import { Observable } from 'rxjs/Observable';

const testNodeResp = {
    'resultCode': '000000',
    'message': '成功',
    'data': {
        'pagination': {
            'page': 1,
            'total': 8,
            'size': 10,
        },
        'data': [
            {
                'name': '172.16.3.231',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.50,
                        'usage': 8.38,
                        'usagePercent': 0.35,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748976.00,
                        'request': 88170496.00,
                        'usage': 80638832.00,
                        'usagePercent': 0.61,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1242125312.00,
                        'request': 0,
                        'usage': 820637784.00,
                        'usagePercent': 0.66,
                    },
                },
                'microServicesCount': 73,
                'ip': '172.16.3.231',
                'joinTime': 1503934960000,
            },
            {
                'name': '172.16.3.232',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.41,
                        'usage': 2.23,
                        'usagePercent': 0.09,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748388.00,
                        'request': 78845952.00,
                        'usage': 76833044.00,
                        'usagePercent': 0.58,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1110451200.00,
                        'request': 0,
                        'usage': 301022232.00,
                        'usagePercent': 0.27,
                    },
                },
                'microServicesCount': 60,
                'ip': '172.16.3.232',
                'joinTime': 1503935782000,
            },
            {
                'name': '172.16.3.233',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.20,
                        'usage': 2.86,
                        'usagePercent': 0.12,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748976.00,
                        'request': 93323264.00,
                        'usage': 62183348.00,
                        'usagePercent': 0.47,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1170301952.00,
                        'request': 0,
                        'usage': 328409208.00,
                        'usagePercent': 0.28,
                    },
                },
                'microServicesCount': 69,
                'ip': '172.16.3.233',
                'joinTime': 1503934964000,
            },
            {
                'name': '172.16.3.234',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.90,
                        'usage': 1.74,
                        'usagePercent': 0.07,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748976.00,
                        'request': 76021760.00,
                        'usage': 80099416.00,
                        'usagePercent': 0.61,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1231966964.00,
                        'request': 0,
                        'usage': 503173840.00,
                        'usagePercent': 0.41,
                    },
                },
                'microServicesCount': 53,
                'ip': '172.16.3.234',
                'joinTime': 1503934961000,
            },
            {
                'name': '172.16.3.235',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.90,
                        'usage': 4.27,
                        'usagePercent': 0.18,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748976.00,
                        'request': 115343360.00,
                        'usage': 88904624.00,
                        'usagePercent': 0.67,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1093322112.00,
                        'request': 0,
                        'usage': 247113764.00,
                        'usagePercent': 0.23,
                    },
                },
                'microServicesCount': 84,
                'ip': '172.16.3.235',
                'joinTime': 1508839246000,
            },
            {
                'name': '172.16.3.236',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.90,
                        'usage': 3.47,
                        'usagePercent': 0.14,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748976.00,
                        'request': 88604672.00,
                        'usage': 63405004.00,
                        'usagePercent': 0.48,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1154987124.00,
                        'request': 0,
                        'usage': 249390396.00,
                        'usagePercent': 0.22,
                    },
                },
                'microServicesCount': 67,
                'ip': '172.16.3.236',
                'joinTime': 1508839240000,
            },
            {
                'name': '172.16.3.237',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.90,
                        'usage': 3.13,
                        'usagePercent': 0.13,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748976.00,
                        'request': 94371840.00,
                        'usage': 59074544.00,
                        'usagePercent': 0.45,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1093322112.00,
                        'request': 0,
                        'usage': 261899656.00,
                        'usagePercent': 0.24,
                    },
                },
                'microServicesCount': 70,
                'ip': '172.16.3.237',
                'joinTime': 1508839247000,
            },
            {
                'name': '172.16.3.238',
                'status': 'HEALTHY',
                'resources': {
                    'cpu': {
                        'name': 'cpu',
                        'unit': '',
                        'limit': 24,
                        'request': 23.90,
                        'usage': 3.28,
                        'usagePercent': 0.14,
                    },
                    'memory': {
                        'name': 'memory',
                        'unit': 'Ki',
                        'limit': 131748976.00,
                        'request': 103284736.00,
                        'usage': 88323792.00,
                        'usagePercent': 0.67,
                    },
                    'storage': {
                        'name': 'storage',
                        'unit': 'Ki',
                        'limit': 1051760000.00,
                        'request': 0,
                        'usage': 272092324.00,
                        'usagePercent': 0.26,
                    },
                },
                'microServicesCount': 77,
                'ip': '172.16.3.238',
                'joinTime': 1508838989000,
            },
        ],
    },
};

export class NodeServiceStub {
  fetchNodeList() {
    return Observable.of(testNodeResp);
  }

  fetchNodeSummary(): Observable<any> {
    return Observable.of({
      'resultCode': '000000',
      'message': '成功',
      'data': {
        'healthyCount': 8,
        'brokenCount': 0,
        'riskyCount': 0,
        'addedCount': 0,
        'freeCount': 0,
        'coreOptions': [24],
      },
    });
  }

}
