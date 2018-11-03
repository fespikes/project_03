import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
import { TuiModalService } from 'tdc-ui';

import { SharedModule } from '../shared';
import { I18nModule } from '../i18n';

import { NodeRoutingModule } from './node-routing.module';
import { NodeComponent } from './node.component';
// import { NodeAsideComponent } from './node-aside/node-aside.component';

import { NodeService } from './node.service';
import { EditTagsComponent } from './edit-tags/edit-tags.component';
import { StorageComponent } from './storage/storage.component';
import { DiskPoolComponent } from './storage/disk-pool/disk-pool.component';
import { LocalDiskComponent } from './storage/local-disk/local-disk.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // ReactiveFormsModule,
    NodeRoutingModule,
    SharedModule,
    I18nModule,
  ],
  declarations: [
    NodeComponent,
    EditTagsComponent,
    StorageComponent,
    DiskPoolComponent,
    LocalDiskComponent,
    // NodeAsideComponent,
  ],
  providers: [
    NodeService,
    TuiModalService,
  ],
  entryComponents: [
    EditTagsComponent,
  ],
})
export class NodeModule { }
