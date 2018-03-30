import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostBinding,
  HostListener,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ServiceTag } from '../../model/system-model';

@Component({
  selector: 'tec-system-service-tag',
  templateUrl: './service-tag.component.html',
  styleUrls: ['./service-tag.component.sass'],
})
export class ServiceTagComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('class.service-tag') hostClass = true;
  @Input() tags: any;

  TAG_WIDTH = 80;
  TAG_PADDING = 10;
  TAG_ELLIPSIS_WIDTH = 20;
  CONTAINER_PADDING = 32;

  showTags: ServiceTag[];

  private sizeSubject = new Subject();

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.sizeSubject.next(event);
  }

  constructor(
    private change: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.sizeSubject
    .debounceTime(200)
    .distinctUntilChanged()
    .subscribe(() => {
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
    const actualWidth = tagContainer.clientWidth - this.CONTAINER_PADDING;
    let maxAccomNum = Math.floor((actualWidth + this.TAG_PADDING) / (this.TAG_WIDTH + this.TAG_PADDING));
    if (maxAccomNum >= this.tags.length) {
      this.setShowTags(this.tags.length);
    }else {
      maxAccomNum = Math.floor((actualWidth - this.TAG_ELLIPSIS_WIDTH) / (this.TAG_WIDTH + this.TAG_PADDING));
      this.setShowTags(maxAccomNum);
      this.addTagEllipsis(maxAccomNum);
    }
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

  ngOnDestroy() {
    this.sizeSubject.complete();
  }
}
