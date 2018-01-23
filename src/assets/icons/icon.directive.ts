
import {
  Directive,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  HostBinding,
} from '@angular/core';

const ICON_COLORS = ['danger', 'primary', 'default', 'warning', 'success', 'info', 'inverse', 'white'];

@Directive({
  selector: '[tecIcon]',
})
export class IconDirective implements OnInit, OnChanges {
  @HostBinding('class.tec-icon') true;
  @HostBinding('style.width') width;
  @HostBinding('style.height') height;
  @Input() tecIcon: string;
  @Input() color: string;
  @Input() size: string;
  node: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');

  constructor(private el: ElementRef) {
    this.el.nativeElement.appendChild(this.node);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const {
      tuiIcon: iconChange,
      size: sizeChange,
      color: colorChange,
    } = changes;
    if (iconChange && iconChange.currentValue) {
      this.setIcon(`#${iconChange.currentValue}`);
    }
    if (sizeChange && sizeChange.currentValue) {
      this.setDims(sizeChange.currentValue);
    }
    if (colorChange && colorChange.currentValue) {
      this.setColor(colorChange.currentValue);
    }
  }

  setIcon(iconName) {
    this.node.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', iconName);
  }

  setDims(size) {
    let unit: string;
    switch (size) {
    case 'lg':
      unit = '24px';
      break;
    case 'md':
      unit = '16px';
      break;
    case 'sm':
      unit = '12px';
      break;
    default:
      unit = size;
    }
    this.width = unit;
    this.height = unit;
  }

  setColor(color) {
    if (ICON_COLORS.indexOf(color)) {
      ICON_COLORS.forEach((c) => {
        this.node.classList.remove(`tui-icon-${c}`);
      });
      this.node.classList.add(`tui-icon-${color}`);
    }
  }

}
