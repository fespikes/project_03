import { SelectionType } from './chart-base';

export class EventListener {
  container: SelectionType;

  constructor(container: SelectionType) {
    this.container = container;
  }
}
