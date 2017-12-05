import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tuiDefault',
})
export class DefaultPipeStub implements PipeTransform {
  transform(value) {
    return value;
  }
}
