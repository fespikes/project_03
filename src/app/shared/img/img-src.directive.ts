import { Directive, Input, OnChanges, ElementRef } from '@angular/core';
import * as path from 'path';

import { IMAGE_PREFIX } from './image-prefix';

@Directive({
  selector: '[tecImgSrc]',
})
export class ImgSrcDirective implements OnChanges {
  @Input() tecImgSrc: string;
  @Input() tecImgPrefix: string;

  constructor(private el: ElementRef) {}

  makeImgSrc() {
    return path.join(this.tecImgPrefix || IMAGE_PREFIX, this.tecImgSrc);
  }

  ngOnChanges() {
    if (this.tecImgSrc) {
      this.el.nativeElement.src = this.makeImgSrc();
    }
  }
}
