import {
  Component, OnInit, HostBinding,
  ElementRef, ViewChild, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { DonutChart, DonutChartConfig } from '../../../chart/lib';
import { NodeService } from '../../node.service';
import { TranslateService } from '../../../i18n';

@Component({
  selector: 'tec-disk-pool',
  templateUrl: './disk-pool.component.html',
  styleUrls: ['./disk-pool.component.sass']
})
export class DiskPoolComponent implements OnInit, OnDestroy {
  @HostBinding('class.loading') get loadingClass() {
    return this.loading;
  }
  @ViewChild('dataUsageDonutHolder') dataUsageDonutHolder: ElementRef;
  @ViewChild('metaUsageDonutHolder') metaUsageDonutHolder: ElementRef;

  loading = false;
  nodeName: string;
  pool: any[];
  store: string;
  storeDetails: any;
  storeDetailsBak: any;
  currentStore: any;
  keyword: string;

  routerSubscriber: any;

  constructor(
    private ele: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private service: NodeService,
    private translateService: TranslateService,
  ) {}

  refresh() {
    // this.pool = null;
    this.storeDetails = {
      dataUsage: {},
      metaUsage: {},
      volumes: [],
      disks: []
    };
    this.storeDetailsBak = this.storeDetails;
  }

  ngOnInit() {
    this.getRouterParams();
    this.routerSubscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    );
    this.routerSubscriber
      .subscribe(() => {
        this.getRouterParams();
      });
  }

  getRouterParams() {
    const promises = [
      this.route.params,
      this.route.queryParams,
    ];
    this.refresh();

    Observable.combineLatest(promises)
    .subscribe(([pathParams, queryParams]) => {
      this.loading = true;
      this.nodeName = pathParams['name'];
      // story = poolName of BE, can from two ways: 1.select ; 2.default the first
      // deprecated
      this.store = queryParams['store'];  // one in the pool

      this.fetchAll(true);
    });
  }

  fetchAll(fromRouterChange?: boolean) {
    if (!this.pool || fromRouterChange) { // at the very beginning
      this.service.getNodePool(this.nodeName)
        .subscribe( pool => {
          this.pool = pool;   // 磁盘池列表
          if (!this.store) {
            if (pool === null) {
              this.loading = false;
              return;
            }
            if (pool && pool.length > 0) {
              this.store = pool[0].name;
              this.getDetailStore();
            }
          }
        });
    }

  }

  selectedDisk(idx, currentStore, $event: MouseEvent) {console.log('selectedDisk');
    const target: any = $event.target;
    let current: any;
    if (!this.ele.nativeElement) {
      return; // no exception guarantee
    }
    if (currentStore === this.currentStore) {
      return;
    }
    this.currentStore = currentStore;
    this.loading = true;

    current = this.ele.nativeElement.querySelector('.current');
    current.classList.remove('current');
    target.classList.add('current');

    this.store = currentStore.name;
    this.getDetailStore();
  }

  getDetailStore() {
    this.service.getStoreDetails(this.nodeName, this.store)
    .subscribe(res => {
      this.storeDetails = {...res}; // 磁盘池details
      this.storeDetailsBak = {...res}; // 磁盘池details
      requestAnimationFrame(argu => {
        try {
          this.showDonuts(res);
        } catch ( e ) {} finally { }
      });
    });
  }

  showDonuts(res) {
    const dataUsage = res.dataUsage;
    const metaUsage = res.metaUsage;
    const donutChartConfig = new DonutChartConfig();
    const configCommon = Object.assign(
      {},
      donutChartConfig,
      {
        operateLegend: {
          show: true,
          position: 'left'
        },
        style: {
          thickness: 50,
          maxRadius: 50,
          top: 40
        },
        bottomLabel: {
          show: false
        },
        legendStyle: {
          width: 160,
          rectWidth: 0,
          rectHeight: 20
        }
      }
    );

    const usageData = (data) => ({
      state: '',
      columns: [
        // '数据',
        `已使用 ${data['used']} ${data['unit']}`,
        `总量 ${data['total']} ${data['unit']}`
      ],
      parts: [
        data['used'], data['total'] - data['used']
      ]
    });

    const dataUsageData = usageData(dataUsage);
    const metaUsageData = usageData(metaUsage);

    const dataUsageConfig = DonutChartConfig.from(configCommon);
    const dataUsageChart = new DonutChart();
    const dataUsageElement: HTMLElement = this.dataUsageDonutHolder.nativeElement;
    dataUsageConfig.donutChartHolder = dataUsageElement;
    dataUsageChart.setConfig(dataUsageConfig).datum( {donuts: [dataUsageData]} );
    dataUsageChart.draw();

    const metaUsageConfig = DonutChartConfig.from(configCommon);
    const metaUsageElement: HTMLElement = this.metaUsageDonutHolder.nativeElement;
    const metaUsageChart = new DonutChart();
    metaUsageConfig.donutChartHolder = metaUsageElement;
    metaUsageChart.setConfig(metaUsageConfig).datum( {donuts: [metaUsageData]} );
    metaUsageChart.draw();

    this.loading = false;
  }

  searchKeywords($event) {
    const val = $event.target.value;
    if (val !== '') {
      this.storeDetails.volumes = this.storeDetailsBak.volumes.filter(item => {
        return item.name.indexOf(val) > -1 || (item.pod.indexOf(val) > -1);
      });
    } else {
      this.storeDetails.volumes = [].concat(this.storeDetailsBak.volumes);
    }
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

}
