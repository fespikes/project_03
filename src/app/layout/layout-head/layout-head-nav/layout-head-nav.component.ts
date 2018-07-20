import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  Input,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { TranslateService } from '../../../i18n';

class Nav {
  link: string;
  name: string;
}

@Component({
  selector: 'tec-layout-head-nav',
  templateUrl: './layout-head-nav.component.html',
  styleUrls: ['./layout-head-nav.component.sass'],
})
export class LayoutHeadNavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('fakeNav') fakeNavElement;
  @Input() navs: Nav[];

  displayNavs: Nav[] = [];
  overflowNavs: Nav[] = [];
  fakeNavName: string;
  private sizeSubject = new Subject();
  private translateSub: Subscription;

  constructor(
    private el: ElementRef,
    private change: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
  ) { }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.sizeSubject.next(event);
  }

  ngAfterViewInit() {
    this.flowNavs();
    this.change.detectChanges();

    this.sizeSubject.pipe(
      debounceTime(200),
      distinctUntilChanged())
      .subscribe(() => {
        this.flowNavs();
      });

    this.translateSub = this.translate.onLangChange
      .subscribe(() => {
        this.flowNavs();
      });
  }

  ngOnDestroy() {
    this.sizeSubject.complete();
    this.translateSub.unsubscribe();
  }

  get activeInOverflow() {
    return this.overflowNavs.some((nav) => {
      return this.router.isActive(nav.link, false);
    });
  }

  getEstimateNavWidth(name: string) {
    this.fakeNavName = name;
    this.change.detectChanges();

    return this.fakeNavElement.nativeElement.offsetWidth;
  }

  flowNavs() {
    this.displayNavs = [];
    this.overflowNavs = [];

    // ‘更多’项目的宽度，20为小三角的宽度
    const moreWidth = this.getEstimateNavWidth('TUI.NAV.MORE') + 20;
    let availableWidth = this.el.nativeElement.offsetWidth;
    const navQueue = this.navs.slice();

    // 尽可能的放入显示栏，直到可用空间用光
    while (navQueue.length > 0) {
      const nav = navQueue[0];
      const navWidth = this.getEstimateNavWidth(nav.name);
      if (availableWidth >= navWidth) {
        this.displayNavs.push(nav);
        navQueue.shift();
        availableWidth -= navWidth;
      } else { // 空间用光,退出
        break;
      }
    }

    if (navQueue.length > 0) {
      // 为放入‘更多’，腾出必要空间
      while (
        availableWidth < moreWidth &&
        this.displayNavs.length > 0
      ) {
        const nav = this.displayNavs.pop();
        navQueue.unshift(nav);
        availableWidth += this.getEstimateNavWidth(nav.name);
      }

      // 将剩余项目推入溢出栏
      this.overflowNavs = navQueue;
    }
  }
}
