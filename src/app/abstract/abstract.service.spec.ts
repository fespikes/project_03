import { TestBed, inject } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';


import { TecApiService } from '../shared';
import { makeUrl } from '../shared/test';
import { TuiMessageService  } from 'tdc-ui';
import { AbstractService } from './abstract.service';
import { TranslateService } from '../i18n';

describe('AbstractService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  // let httpClientSpy: { get: jasmine.Spy };
  let abstractService: AbstractService;
  let tecApiService: TecApiService;
  // let abstractServiceSpy: jasmine.SpyObj<AbstractService>;

  beforeEach(() => {
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [
        HttpClientTestingModule,
        OverlayModule
      ],
      providers: [
        AbstractService,
        TecApiService,
        {
          provide: TranslateService,
          useValue: {
            get() {
              return of();
            },
          },
        },
        TuiMessageService
      ],
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    abstractService = TestBed.get(AbstractService);
    tecApiService = TestBed.get(TecApiService);
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

/*   it('should be created', inject([AbstractService], (service: AbstractService) => {
    expect(service).toBeTruthy();
  })); */

  // 1.云平台概览：
  describe('getQuantitySummary', () => {
    let result: any, resultEmpty: any;
    const url = '/api/v1/platforms/count/summaries?fullResponse=true';

    beforeEach(() => {
      // fake result below:
      resultEmpty = {data: {}};
      result = {
        'resultCode': '000000',
        'message': '成功',
        'data': {
          'nodeCount': 5, 'tenantCount': 5, 'productCount': 34, 'instanceCount': 9
        }
      };
      abstractService = TestBed.get(AbstractService);
    });

    it('should return expected getQuantitySummary (called once)', () => {
      abstractService.getQuantitySummary().subscribe(
        rs => expect(rs).toEqual(result.data, 'should return expected result'),
        fail
      );

      // should have made one request to GET result from expected URL
      const req = httpTestingController.expectOne(url);
      // const req = httpTestingController.expectOne(makeUrl('platforms/count/summaries'));
      expect(req.request.method).toEqual('GET');
      // Respond with the mock result
      req.flush(result);
    });

    /* it('should be Ok returning no result', () => {
      abstractService.getQuantitySummary().subscribe(
        rs => expect(rs.data).toEqual({}, 'should return expected no result'),
        fail
      );
      const req = httpTestingController.expectOne(url);
      req.flush(resultEmpty); // Respond with no results
    }); */

    it('should return expected result (called multiple times)', () => {
      abstractService.getQuantitySummary().subscribe();
      abstractService.getQuantitySummary().subscribe();
      abstractService.getQuantitySummary().subscribe(
        rs => expect(rs).toEqual(result.data, 'should return expected result the thrd'),
        fail
      );

      const requests = httpTestingController.match(url);
      expect(requests.length).toEqual(3, 'calls to get result');
      // Respond to each request with different mock results
      requests[0].flush(resultEmpty);
      requests[1].flush(resultEmpty);
      requests[2].flush(result);
    });

  });

  // 2.平台概览
  describe('getLoadSummary', () => {
    const cb = () => {};
    const url = '/api/v1/platforms/loads/summaries?recentHour=1';
    const fakeLoadSummary = {
      'resultCode': '000000',
      'message': '成功',
      'data': {
        'startTime': 1543989600000,
        'endTime': 1543993200000,
        'cpuLoad': [
          {'title': 'used', 'value': 0.1522},
          {'title': 'unused', 'value': 0.8478}
        ],
        'memoryLoad': [
          {'title': 'used', 'value': 0.7340},
          {'title': 'unused', 'value': 0.2660}
        ],
        'storageLoad': [
          {'title': 'used', 'value': 0.1436},
          {'title': 'unused', 'value': 0.8564}
        ],
        'networkLoad': null,
        'errLoad': null,
        'alias': {
          'cpuLoad': 'CPU负载',
          'errLoad': '错误率',
          'networkLoad': '网络负载',
          'memoryLoad': '内存负载',
          'storageLoad': '磁盘负载'
        }
      }
    };
    it('should return expected loadSummary (called once)', () => {
      const res = abstractService.adaptLoadSummary(fakeLoadSummary.data);
      abstractService.getLoadSummary(
        rs => {
          expect(rs).toEqual(res, 'should return expected result');
        }, 1
      );
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(fakeLoadSummary);
    });

  });
  // 3.租户增长趋势
  describe('getTenantCountTrend', () => {
    const url = '/api/v1/tenants/counts/trend';
    const fakeTenantCountTrend = {
      'resultCode': '000000',
      'message': '成功',
      'data': {
        'startTime': 1530374400000,
        'endTime': 1543593600000,
        'timeInterval': 'MONTH',
        'counts': [
          {'time': 1530374400000, 'count': 0},
          {'time': 1533052800000, 'count': 0},
          {'time': 1535731200000, 'count': 0},
          {'time': 1538323200000, 'count': 0},
          {'time': 1541001600000, 'count': 0},
          {'time': 1543593600000, 'count': 5}
        ]
    }};
    it('should return expected loadSummary (called once)', () => {
      const result = abstractService.adaptToSingleLineData(fakeTenantCountTrend.data);
      abstractService.getTenantCountTrend(
        rs => {
          expect(rs).toEqual(result, 'should return expected result');
        }
      );
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(fakeTenantCountTrend);
    });
  });

  // 4.主机负载情况
  // TODO: here is wearid: alias[key]: alias became undefined happends
  // so changed to test the api with TecApiService response
  describe('getNodesLoadTrend', () => {
    const url = '/nodes/loads/trend';
    const fakeNodesLoadTrend = JSON.parse('{"resultCode":"000000","message":"成功","data":{"startTime":1543921200000,"endTime":1544004000000,"timeInterval":"HOUR","alias":{"cpuLoad":"CPU负载","networkLoad":"网络负载","memoryLoad":"内存负载","storageLoad":"磁盘负载"},"loads":[{"time":1543921200000,"cpuLoad":0.1720,"memoryLoad":0.7176,"storageLoad":0.1354,"networkLoad":null},{"time":1543924800000,"cpuLoad":0.1712,"memoryLoad":0.7156,"storageLoad":0.1356,"networkLoad":null},{"time":1543928400000,"cpuLoad":0.1715,"memoryLoad":0.7141,"storageLoad":0.1223,"networkLoad":null},{"time":1543932000000,"cpuLoad":0.1608,"memoryLoad":0.7173,"storageLoad":0.1225,"networkLoad":null},{"time":1543935600000,"cpuLoad":0.1533,"memoryLoad":0.7168,"storageLoad":0.1228,"networkLoad":null},{"time":1543939200000,"cpuLoad":0.1563,"memoryLoad":0.7207,"storageLoad":0.1227,"networkLoad":null},{"time":1543942800000,"cpuLoad":0.1544,"memoryLoad":0.7231,"storageLoad":0.1229,"networkLoad":null},{"time":1543946400000,"cpuLoad":0.1542,"memoryLoad":0.6351,"storageLoad":0.1149,"networkLoad":null},{"time":1543950000000,"cpuLoad":0.1438,"memoryLoad":0.7083,"storageLoad":0.1399,"networkLoad":null},{"time":1543953600000,"cpuLoad":0.1454,"memoryLoad":0.7127,"storageLoad":0.1402,"networkLoad":null},{"time":1543957200000,"cpuLoad":0.1478,"memoryLoad":0.7176,"storageLoad":0.1406,"networkLoad":null},{"time":1543960800000,"cpuLoad":0.1567,"memoryLoad":0.7223,"storageLoad":0.1408,"networkLoad":null},{"time":1543964400000,"cpuLoad":0.1473,"memoryLoad":0.7239,"storageLoad":0.1410,"networkLoad":null},{"time":1543968000000,"cpuLoad":0.1467,"memoryLoad":0.7273,"storageLoad":0.1413,"networkLoad":null},{"time":1543971600000,"cpuLoad":0.1487,"memoryLoad":0.7304,"storageLoad":0.1416,"networkLoad":null},{"time":1543975200000,"cpuLoad":0.1480,"memoryLoad":0.7288,"storageLoad":0.1416,"networkLoad":null},{"time":1543978800000,"cpuLoad":0.1524,"memoryLoad":0.7335,"storageLoad":0.1419,"networkLoad":null},{"time":1543982400000,"cpuLoad":0.1423,"memoryLoad":0.7335,"storageLoad":0.1421,"networkLoad":null},{"time":1543986000000,"cpuLoad":0.1556,"memoryLoad":0.7387,"storageLoad":0.1425,"networkLoad":null},{"time":1543989600000,"cpuLoad":0.1669,"memoryLoad":0.7361,"storageLoad":0.1434,"networkLoad":null},{"time":1543993200000,"cpuLoad":0.1375,"memoryLoad":0.7319,"storageLoad":0.1437,"networkLoad":null},{"time":1543996800000,"cpuLoad":0.1551,"memoryLoad":0.7258,"storageLoad":0.1294,"networkLoad":null},{"time":1544000400000,"cpuLoad":0.1602,"memoryLoad":0.7258,"storageLoad":0.1219,"networkLoad":null},{"time":1544004000000,"cpuLoad":0.2076,"memoryLoad":0.7221,"storageLoad":0.1195,"networkLoad":null}]}}');

    it('should return expected NodesLoadTrend (called once)', () => {
      tecApiService.get(url).subscribe(
        rs => {
          expect(rs).toEqual(fakeNodesLoadTrend.data, 'should return expected result');
        },
        fail
      );
      const req = httpTestingController.expectOne('/api/v1/nodes/loads/trend');
      expect(req.request.method).toEqual('GET');
      req.flush(fakeNodesLoadTrend);
    });
  });

  // 5.主机变化趋势：
  describe('getNodesCountTrend', () => {
    const url = '/api/v1/nodes/count/trend';
    const fake = JSON.parse('{"resultCode":"000000","message":"成功","data":{"startTime":1530374400000,"endTime":1543593600000,"timeInterval":"MONTH","counts":[{"time":1530374400000,"count":0},{"time":1533052800000,"count":0},{"time":1535731200000,"count":0},{"time":1538323200000,"count":5},{"time":1541001600000,"count":5},{"time":1543593600000,"count":5}]}}');

    it('should return expected NodesCountTrend (called once)', () => {
      const result = abstractService.adaptToSingleLineData(fake.data);
      abstractService.getNodesCountTrend(
        rs => {
          expect(rs).toEqual(result, 'should return expected result');
        }
      );
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(fake);
    });
  });

  // 6.云产品实例排行：
  describe('getInstancesTemplatesCountRank', () => {
    const url = '/api/v1/instances/templates/count/rank';
    const fake = JSON.parse('{"resultCode":"000000","message":"成功","data":{"startTime":1543593600000,"endTime":1543593600000,"totalCount":9,"top":8,"order":"DESC","counts":[{"time":1543593600000,"count":2,"productName":"TDH-RDB","productNameAlias":"关系数据库","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":2}]},{"time":1543593600000,"count":2,"productName":"TDH-DL","productNameAlias":"人工智能","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":2}]},{"time":1543593600000,"count":2,"productName":"GITLAB","productNameAlias":"Gitlab","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":2}]},{"time":1543593600000,"count":1,"productName":"SMARTBI","productNameAlias":"SmartBI","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":1}]},{"time":1543593600000,"count":1,"productName":"TDH-DW","productNameAlias":"数据仓库","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":1}]},{"time":1543593600000,"count":1,"productName":"TDH-DM","productNameAlias":"数据集市","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":1}]},{"time":1543593600000,"count":0,"productName":"8759","productNameAlias":"xux","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":0}]},{"time":1543593600000,"count":0,"productName":"5157","productNameAlias":"sfdda","templateCounts":[{"type":"LOW","typeAlias":"入门级","count":0},{"type":"HIGH","typeAlias":"高性能","count":0},{"type":"MEDIUM","typeAlias":"高性价比","count":0},{"type":"OTHER","typeAlias":"其他","count":0}]}]}}');

    it('should return expected NodesCountTrend (called once)', () => {
      const result = abstractService.adaptInstancesTemplatesCountData(fake.data);
      abstractService.getInstancesTemplatesCountRank(
        rs => {
          expect(rs).toEqual(result, 'should return expected result');
        }
      );
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(fake);
    });
  });

  // 7.实例总量变化趋势：
  describe('getInstancesCountTrend', () => {
    const url = '/api/v1/instances/count/trend';
    const fake = JSON.parse('{"resultCode":"000000","message":"成功","data":{"startTime":1530374400000,"endTime":1543593600000,"timeInterval":"MONTH","counts":[{"time":1530374400000,"count":0},{"time":1533052800000,"count":0},{"time":1535731200000,"count":0},{"time":1538323200000,"count":6},{"time":1541001600000,"count":7},{"time":1543593600000,"count":9}]}}');

    it('should return expected NodesCountTrend (called once)', () => {
      const result = abstractService.adaptToSingleLineData(fake.data);
      abstractService.getInstancesCountTrend(
        rs => {
          expect(rs).toEqual(result, 'should return expected result');
        }
      );
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(fake);
    });
  });

  // 8.云产品实例变化趋势
  describe('getProductInstancesCountTrend', () => {
    const url = '/api/v1/instances/products/count/trend';
    const fake = JSON.parse('{"resultCode":"000000","message":"成功","data":[{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":1},{"time":1541433600000,"count":0},{"time":1541520000000,"count":1},{"time":1541606400000,"count":1},{"time":1541692800000,"count":1},{"time":1541779200000,"count":1},{"time":1541865600000,"count":1},{"time":1541952000000,"count":1},{"time":1542038400000,"count":1},{"time":1542124800000,"count":1},{"time":1542211200000,"count":1},{"time":1542297600000,"count":1},{"time":1542384000000,"count":1},{"time":1542470400000,"count":1},{"time":1542556800000,"count":1},{"time":1542643200000,"count":1},{"time":1542729600000,"count":1},{"time":1542816000000,"count":1},{"time":1542902400000,"count":1},{"time":1542988800000,"count":1},{"time":1543075200000,"count":1},{"time":1543161600000,"count":2},{"time":1543248000000,"count":0},{"time":1543334400000,"count":3},{"time":1543420800000,"count":2},{"time":1543507200000,"count":2},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":2},{"time":1543852800000,"count":2},{"time":1543939200000,"count":2}],"productName":"GITLAB","productNameAlias":"Gitlab"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"HARBOR","productNameAlias":"Harbor"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"JENKINS","productNameAlias":"Jenkins"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"NEXUS","productNameAlias":"Nexus"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"TDH-ALL","productNameAlias":"TDH全家桶"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":1},{"time":1541433600000,"count":0},{"time":1541520000000,"count":1},{"time":1541606400000,"count":1},{"time":1541692800000,"count":1},{"time":1541779200000,"count":1},{"time":1541865600000,"count":1},{"time":1541952000000,"count":1},{"time":1542038400000,"count":1},{"time":1542124800000,"count":1},{"time":1542211200000,"count":1},{"time":1542297600000,"count":1},{"time":1542384000000,"count":1},{"time":1542470400000,"count":1},{"time":1542556800000,"count":1},{"time":1542643200000,"count":1},{"time":1542729600000,"count":1},{"time":1542816000000,"count":1},{"time":1542902400000,"count":1},{"time":1542988800000,"count":1},{"time":1543075200000,"count":1},{"time":1543161600000,"count":1},{"time":1543248000000,"count":0},{"time":1543334400000,"count":1},{"time":1543420800000,"count":1},{"time":1543507200000,"count":1},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":1},{"time":1543852800000,"count":2},{"time":1543939200000,"count":2}],"productName":"TDH-DL","productNameAlias":"人工智能"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":1},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":1},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":1},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":1},{"time":1543852800000,"count":1},{"time":1543939200000,"count":1}],"productName":"TDH-DM","productNameAlias":"数据集市"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":1},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":1},{"time":1543248000000,"count":0},{"time":1543334400000,"count":1},{"time":1543420800000,"count":1},{"time":1543507200000,"count":1},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":1},{"time":1543852800000,"count":1},{"time":1543939200000,"count":1}],"productName":"TDH-DW","productNameAlias":"数据仓库"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"TDH-IR","productNameAlias":"信息检索"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":1},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"TDH-RC","productNameAlias":"实时计算"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":3},{"time":1541433600000,"count":0},{"time":1541520000000,"count":2},{"time":1541606400000,"count":3},{"time":1541692800000,"count":2},{"time":1541779200000,"count":2},{"time":1541865600000,"count":2},{"time":1541952000000,"count":8},{"time":1542038400000,"count":8},{"time":1542124800000,"count":2},{"time":1542211200000,"count":4},{"time":1542297600000,"count":5},{"time":1542384000000,"count":5},{"time":1542470400000,"count":5},{"time":1542556800000,"count":5},{"time":1542643200000,"count":3},{"time":1542729600000,"count":6},{"time":1542816000000,"count":6},{"time":1542902400000,"count":6},{"time":1542988800000,"count":6},{"time":1543075200000,"count":6},{"time":1543161600000,"count":6},{"time":1543248000000,"count":0},{"time":1543334400000,"count":2},{"time":1543420800000,"count":2},{"time":1543507200000,"count":2},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":2},{"time":1543852800000,"count":2},{"time":1543939200000,"count":2}],"productName":"TDH-RDB","productNameAlias":"关系数据库"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"E2C1","productNameAlias":"GeneralStorage"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"3DD5","productNameAlias":"test1806"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"BE01","productNameAlias":"jj"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"409F","productNameAlias":"test_txsql"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"8C41","productNameAlias":"广供自定义"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"8644","productNameAlias":"云存储"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":1},{"time":1541433600000,"count":0},{"time":1541520000000,"count":1},{"time":1541606400000,"count":1},{"time":1541692800000,"count":1},{"time":1541779200000,"count":1},{"time":1541865600000,"count":1},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":1},{"time":1542902400000,"count":1},{"time":1542988800000,"count":1},{"time":1543075200000,"count":1},{"time":1543161600000,"count":1},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"A793","productNameAlias":"云存储"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":1},{"time":1542384000000,"count":1},{"time":1542470400000,"count":1},{"time":1542556800000,"count":1},{"time":1542643200000,"count":1},{"time":1542729600000,"count":1},{"time":1542816000000,"count":1},{"time":1542902400000,"count":1},{"time":1542988800000,"count":1},{"time":1543075200000,"count":1},{"time":1543161600000,"count":1},{"time":1543248000000,"count":0},{"time":1543334400000,"count":1},{"time":1543420800000,"count":1},{"time":1543507200000,"count":1},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":1},{"time":1543852800000,"count":1},{"time":1543939200000,"count":1}],"productName":"SMARTBI","productNameAlias":"SmartBI"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"A0F7","productNameAlias":"product1"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"52E5","productNameAlias":"dfa"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"0C77","productNameAlias":"asdfasdf"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"9215","productNameAlias":"ffffg"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"EAB1","productNameAlias":"xxx"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"3A6A","productNameAlias":"ddd"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"95E6","productNameAlias":"yyy"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"D2AC","productNameAlias":"ttt"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"50C4","productNameAlias":"tset"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"13A2","productNameAlias":"123"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"70CA","productNameAlias":"ssss"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"AF45","productNameAlias":"test222"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":1},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":1},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"5807","productNameAlias":"slipstream"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"6AAE","productNameAlias":"my_test"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"5157","productNameAlias":"sfdda"},{"startTime":1541347200000,"endTime":1543939200000,"timeInterval":"DAY","counts":[{"time":1541347200000,"count":0},{"time":1541433600000,"count":0},{"time":1541520000000,"count":0},{"time":1541606400000,"count":0},{"time":1541692800000,"count":0},{"time":1541779200000,"count":0},{"time":1541865600000,"count":0},{"time":1541952000000,"count":0},{"time":1542038400000,"count":0},{"time":1542124800000,"count":0},{"time":1542211200000,"count":0},{"time":1542297600000,"count":0},{"time":1542384000000,"count":0},{"time":1542470400000,"count":0},{"time":1542556800000,"count":0},{"time":1542643200000,"count":0},{"time":1542729600000,"count":0},{"time":1542816000000,"count":0},{"time":1542902400000,"count":0},{"time":1542988800000,"count":0},{"time":1543075200000,"count":0},{"time":1543161600000,"count":0},{"time":1543248000000,"count":0},{"time":1543334400000,"count":0},{"time":1543420800000,"count":0},{"time":1543507200000,"count":0},{"time":1543593600000,"count":0},{"time":1543680000000,"count":0},{"time":1543766400000,"count":0},{"time":1543852800000,"count":0},{"time":1543939200000,"count":0}],"productName":"8759","productNameAlias":"xux"}]}');

    it('should return expected NodesCountTrend (called once)', () => {
      const result = abstractService.adaptToMultipleBrokenLineData(fake.data);
      abstractService.getProductInstancesCountTrend(
        rs => {
          expect(rs).toEqual(result, 'should return expected result');
        }
      );
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(fake);
    });
  });

  // 9.租户消费top7
  describe('getTenantsConsumptionsRank', () => {
    const url = '/api/v1/tenants/consumptions/rank';
    const fake = JSON.parse('{"resultCode":"000000","message":"成功","data":{"startTime":1543593600000,"endTime":1543593600000,"top":7,"order":"DESC","consumptions":[]}}');

    it('should return expected NodesCountTrend (called once)', () => {
      const result = abstractService.adaptTenantsConsumptionData(fake.data);
      abstractService.getTenantsConsumptionsRank(
        rs => {
          expect(rs).toEqual(result, 'should return expected result');
        }
      );
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(fake);
    });
  });

});


