import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';


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
    return this.intervalSub = Observable.interval(this.timeInterval).filter(() => {
      const width = this.elementRef.nativeElement.offsetWidth;
      if (this.hostWidth !== width) {
        this.hostWidth = width;
        return true;
      }
    });
  }

}
