import {
  Component,
  OnInit,
  HostBinding,
  Input,
  HostListener,
} from '@angular/core';

import { TuiMessageService } from 'tdc-ui';
import { TranslateService } from 'app/i18n';

@Component({
  selector: 'tec-copy-button',
  template: '<ng-content></ng-content>',
  styleUrls: ['./copy-button.component.sass'],
})
export class CopyButtonComponent implements OnInit {
  @HostBinding('class.tec-copy-button') host = true;

  @Input() text: string;

  @HostListener('click', ['$event.target'])
  onClick() {
    this.copy();
  }

  constructor(
    private message: TuiMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
  }

  copy() {
    if (!this.text) {
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = this.text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.message.success(this.translate.translateKey('SYSTEM.POPUP.COPIED'));
      } else {
        this.message.error('SYSTEM.POPUP.COPY_FAILED');
      }
    } catch (err) {
      this.message.error('SYSTEM.POPUP.COPY_FAILED');
    }

    document.body.removeChild(textArea);
  }
}
