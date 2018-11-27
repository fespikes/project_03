
import {combineLatest as observableCombineLatest,  Observable } from 'rxjs';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


import { TuiModalService } from 'tdc-ui';
import { NodeService } from '../node.service';
import { TranslateService } from 'app/i18n';

@Component({
  selector: 'tec-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.sass']
})
export class StorageComponent implements OnInit, OnDestroy {
  @HostBinding('class.tui-layout-body') hostClass = true;
  loading = false;
  backUrl = '/node';
  submenuItems: any[] = [];
  selectedTabIndex = 0;
  nodeName: string;
  poolName: string;
  total = 0;

  nodes: any[];
  pools: any[] = [];
  poolDetails: any = {};
  poolLoading = false;  // the first tab
  diskLoading = false;  // the last tab

  routerSubscriber: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: TuiModalService,
    private service: NodeService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.loading = true;
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
        const selectedTabIndex = queryParams['idx'];
        this.selectedTabIndex = +selectedTabIndex || this.selectedTabIndex;
        this.service.fetchNodeList()
          .subscribe(nodes => {
            this.nodes = [...nodes.data];
            this.submenuItems = this.makeSubMenuItems(nodes.data);
            this.total = nodes.pagination.total;
            this.loading = false;
          });
      });
  }

  makeSubMenuItems(nodes?: any) {
    const arr = nodes || this.nodes;
    const submenuItems = arr.map((item) => ({
      name: item.name ,
      url: `/management/storage/${item.name}`,
      icon: '',
    }));

    return submenuItems;
  }

  // tab index change here
  selectedIndexChange(index: number) {
    this.selectedTabIndex = index;
    this.submenuItems = this.makeSubMenuItems();
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

}
