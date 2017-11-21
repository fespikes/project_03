import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tecFilter',
})
export class FilterPipeStub implements PipeTransform {
  transform(value) {
    return value;
  }
}
