import {
  Component, OnInit,
  Input, Output,
  EventEmitter,
} from '@angular/core';
import { editTypes } from './edit-model';

@Component({
  selector: 'tec-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass'],
})
export class EditComponent implements OnInit {

  @Input() key: string;
  @Input() editingKey: string;
  @Output() editChange = new EventEmitter();

  editing = false;
  invalid = false;  // TODO:

  constructor() { }

  ngOnInit() {}

  edit(type: string, p?) {
    switch (type) {
      case editTypes.edit:
        this.editing = true;
        break;
      case editTypes.save:
        this.editing = false;
        break;
      case editTypes.cancel:
        this.editing = false;
        break;

      default:
        break;
    }
    this.editChange.emit({
      type: type,
      key: this.key,
    });
    return false;
  }

}
