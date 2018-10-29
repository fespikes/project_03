import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostBinding,
  HostListener,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ServiceTag } from '../../model/system-model';

@Component({
  selector: 'tec-system-service-tag',
  templateUrl: './service-tag.component.html',
  styleUrls: ['./service-tag.component.sass'],
})
export class ServiceTagComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('class.service-tag') hostClass = true;
  @Input() tags: any;
  @Input() ifExpend = false;
  @Output() openEditModel: EventEmitter<any> = new EventEmitter();
  expended = false;
  maxAccomNum: number;

  TAG_WIDTH = 80;
  TAG_PADDING = 10;
  TAG_ELLIPSIS_WIDTH = 20;
  TAG_EXPEND_WIDTH = 50;
  CONTAINER_PADDING = 0;
  PENCIL_WIDTH = 28;

  showTags: ServiceTag[];
  expendingFlag = false;

  private sizeSubject = new Subject();

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.sizeSubject.next(event);
  }

  constructor(
    private change: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.sizeSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.arrangeTags();
      this.change.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.arrangeTags();
    this.change.detectChanges();
  }

  arrangeTags() {
    const tagContainer = document.getElementsByClassName('system-service-tag')[0];
    // TODO:
    const actualWidth = tagContainer.clientWidth - this.CONTAINER_PADDING;
    let maxAccomNum = Math.floor((actualWidth + this.TAG_PADDING) / (this.TAG_WIDTH + this.TAG_PADDING));
    if (maxAccomNum >= this.tags.length) {
      this.setShowTags(this.tags.length);
    } else {
      if (this.ifExpend) {
        if (this.expended) {
          maxAccomNum = this.tags.length;
        } else {
          maxAccomNum = Math.floor((actualWidth - this.TAG_EXPEND_WIDTH - this.PENCIL_WIDTH) / (this.TAG_WIDTH + this.TAG_PADDING));
        }
        this.setShowTags(maxAccomNum);
        this.showExpend(maxAccomNum);
      } else {
        maxAccomNum = Math.floor((actualWidth - this.TAG_ELLIPSIS_WIDTH) / (this.TAG_WIDTH + this.TAG_PADDING));
        this.setShowTags(maxAccomNum);
        this.addTagEllipsis(maxAccomNum);
      }
    }
    this.maxAccomNum = maxAccomNum;
  }

  setShowTags(showNum) {
    const tagsArray = this.tags.slice(0, showNum);
    this.showTags = tagsArray.map(tag => {
      return {
        name: tag,
        width: this.TAG_WIDTH,
      };
    });
  }

  addTagEllipsis(showNum) {
    this.showTags = this.showTags.slice(0, showNum);
    this.showTags.push({
      name: '...',
      width: this.TAG_ELLIPSIS_WIDTH,
    });
  }

  showExpend(showNum) {
    this.showTags = this.showTags.slice(0, showNum);
    this.expendingFlag = true;
/*     this.showTags.push({
      name: 'more',
      width: this.TAG_EXPEND_WIDTH,
    }); */
  }

  switchExpended() {
    this.expended = !this.expended;
    this.arrangeTags();
  }

  ngOnDestroy() {
    this.sizeSubject.complete();
  }

  /* edit($event) {
    console.log('in edit', $event);
    this.openEditModel.emit($event);
  } */
}
