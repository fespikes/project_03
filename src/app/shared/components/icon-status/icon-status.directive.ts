import {
  Directive,
  Input,
  Host,
} from '@angular/core';

import { IconDirective } from 'tdc-ui';

const IconMappings = {
  CREATING: 'preparing',
  ACTIVATING: 'circle',
  CANCELED: 'ban2',
};

const ColorMappings = {
  CREATING: 'primary',
  ACTIVATING: 'success',
  CANCELED: 'danger',
};

@Directive({
  selector: '[tecIconStatus]',
})
export class IconStatusDirective {
  @Input() set tecIconStatus(status) {
    if (!this.icon.tuiIcon) {
      const icon = IconMappings[status];
      this.icon.setIcon(`#${icon}`);
    }
    const color = ColorMappings[status];
    this.icon.setColor(color);
  }

  constructor( @Host() private icon: IconDirective) { }
}
