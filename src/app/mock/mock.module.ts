import { NgModule } from '@angular/core';

import { DefaultPipeStub, TranslatePipeStub, FilterPipeStub } from './pipe';

@NgModule({
  declarations: [
    DefaultPipeStub,
    TranslatePipeStub,
    FilterPipeStub,
  ],
  exports: [
    DefaultPipeStub,
    TranslatePipeStub,
    FilterPipeStub,
  ],
})
export class MockModule { }
