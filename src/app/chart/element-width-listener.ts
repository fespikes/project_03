
import {interval as observableInterval,  Observable ,  Subscription } from 'rxjs';
import { ElementRef } from '@angular/core';

import { filter } from 'rxjs/operators';

export class ElementWidthListener {
  intervalSub: Observable<any>;

  hostWidth: -1;

  constructor(
    private elementRef: ElementRef,
    private timeInterval = 100,
  ) {
    this.hostWidth = elementRef.nativeElement.offsetWidth;
  }

  startListen() {
    return this.intervalSub = observableInterval(this.timeInterval).pipe(filter(() => {
      const width = this.elementRef.nativeElement.offsetWidth;
      if (this.hostWidth !== width) {
        this.hostWidth = width;
        return true;
      }
    }));
  }

}
