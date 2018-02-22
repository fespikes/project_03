import { Component, OnInit } from '@angular/core';
import { TuiModalRef } from 'tdc-ui';

@Component({
  selector: 'tec-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {

  private params: any = {
    oldPassword: '',
    newPassword: '',
    confirm: '',
  };

  constructor(
    private modal: TuiModalRef,
  ) { }

  ngOnInit() {
  }

  submit($event) {
    console.log('submit:', $event);
    this.modal.close('closed');
  }

  quit($event) {
    console.log('submit:', $event);
  }

}
