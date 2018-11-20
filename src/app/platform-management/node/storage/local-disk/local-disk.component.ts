
import {combineLatest as observableCombineLatest,  Observable ,  fromEvent } from 'rxjs';
import {
  Component, OnInit,
  ElementRef, ViewChild,
  HostBinding, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import {
  DonutChart, DonutChartData, DonutChartConfig
} from 'app/chart/lib';
import { NodeService } from '../../node.service';
import { TranslateService } from 'app/i18n';

@Component({
  selector: 'tec-local-disk',
  templateUrl: './local-disk.component.html',
  styleUrls: ['./local-disk.component.sass']
})
export class LocalDiskComponent implements OnInit, OnDestroy {
  @HostBinding('class.loading') get loadingClass() {
    return this.loading;
  }
  loading = false;
  nodeName: string;
  disks: any[] = [];
  keyword: Observable<string>;
  @ViewChild('search') search: ElementRef;

  routerSubscriber: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: NodeService,
    private translateService: TranslateService
  ) { }

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

    observableCombineLatest(promises)
    .subscribe(([pathParams, queryParams]) => {
      this.nodeName = pathParams['name'];
      this.fetchDisks();
    });
  }

  fetchDisks() {
    this.loading = true;
    return this.service.getLocalDisks(this.nodeName, this.keyword)
      .subscribe(res => {
        this.disks = res;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

}
