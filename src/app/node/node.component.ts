import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Pagination, TuiModalService, TuiMessageService } from 'tdc-ui';

import { TranslateService } from 'app/i18n';
import { TecApiService } from 'app/shared';
import { NodeService } from './node.service';
import { NodeFilter } from './node.model';
import { EditTagsComponent } from './edit-tags/edit-tags.component';

const FileSaver = require('app/shared/FileSaver');

@Component({
  selector: 'tec-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.sass'],
})
export class NodeComponent implements OnInit {

  @HostBinding('class.tui-layout-body') hostClass = true;

  loading = true;

  newAddedThisMonth: number;
  tableData: any = [];
  units: any = {};
  coreOptions: any[] = [];
  statusOptions: any[] = [];

  filter = new NodeFilter();
  pagination = new Pagination();

  constructor(
    private nodeService: NodeService,
    private api: TecApiService,
    private modalService: TuiModalService,
    private message: TuiMessageService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchTableData();
    this.nodeService.nodeDetailsObservable
      .subscribe(argu => {
        this.fetchTableData();
      });
  }

  fetchTableData() {
    this.loading = true;
    this.filter.page = this.pagination.page;
    this.filter.size = this.pagination.size;
    this.nodeService.fetchNodeList(this.filter).subscribe(response => {
      const resOptions = response.options;
      this.newAddedThisMonth = resOptions.addedCount;
      this.units = resOptions.unit;
      this.coreOptions = resOptions.coreOptions;
      this.statusOptions = resOptions.statusOptions;
      this.tableData = response.data;
      this.pagination = response.pagination;
      this.loading = false;

      if (!resOptions.unit) { // mock
        this.units = {
          cpu: 'core',
          memory: 'Gi',
          storage: 'Gi',
        };
      }

      this.tableData.map((item, idx) => {
        const keys = [];
        const labelsStrgings = [];
        item.labels.map((cur, ids) => {
          labelsStrgings.push(cur.key + '=' + cur.value);
          keys.push(cur.key);
        });

        item.labelsStrgings = labelsStrgings;
        item.keys = keys;
      });
    });
  }

  parseFloat(i: any, key: string) {
    const resources = i.resources;
    if (!resources) { return ''; }

    const sub = resources[key];
    if (!sub) { return ''; }

    const usage = sub['usage'];
    const limit = sub['limit'];
    // const unit = sub['unit'];
    // let usagePercent = sub['usagePercent'];

    // usage = (usage && unit) ? (usage + unit) : '';
    // usagePercent = usagePercent ? (usagePercent + '%') : '';
    // return usage + ' ' + usagePercent;
    return usage && limit ? (usage + ' /' + limit) : '-- / --';
  }

  filterChange() {
    this.fetchTableData();
  }

  export() {
    this.api.getFile('nodes/export')
    .subscribe((data) => {
      const fileBlob = new Blob([data.body], {type: 'application/vnd.ms-excel'});
      FileSaver.saveAs(fileBlob, 'nodes.xls');
    });
  }

  openEditModel(node, $event: MouseEvent, size = 'md') {
    const name = node.name;
    return this.modalService.open(EditTagsComponent, {
      // TODO: i18n
      title: this.translateService.translateKey('编辑标签 - ') + name,
      size,
      data: {
        tags: node.labelsStrgings,
        keys: node.keys,
        name: name
      }
    })
    .subscribe((word: string) => {
      this.fetchTableData();
    });
  }

  toStorageDetails(node, idx) {
    this.router.navigate([`/node/storage/${node.name}`], {
      queryParams: {
        idx: 0,
      }
    });
  }

}
