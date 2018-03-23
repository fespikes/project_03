import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconSymbolComponent, IconDirective } from './';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IconDirective,
    IconSymbolComponent,
  ],
  exports: [
    IconDirective,
    IconSymbolComponent,
  ],
})
export class IconModule { }
