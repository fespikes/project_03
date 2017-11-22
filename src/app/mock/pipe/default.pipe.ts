import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tecDefault',
})
export class DefaultPipeStub implements PipeTransform {
  transform(value) {
    return value;
  }
}
