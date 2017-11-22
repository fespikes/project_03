import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'translate'})
export class TranslatePipeStub implements PipeTransform {
  transform(value) {
    return value;
  }
}
