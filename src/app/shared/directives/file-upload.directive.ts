import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[tecFileUpload]'
})
export class FileUploadDirective {

  @Output() fileChanged = new EventEmitter<File>();

  constructor() {
  }

  @HostListener('click')
  clickOn() {
    const input: HTMLInputElement = document.createElement('input');
    input.setAttribute('multiple', 'multiple');
    input.type = 'file';
    input.click();

    // emitted when selectd files
    input.addEventListener('change', (event: any) => {
      const {files} = event.target;
      let file: File;

      for (let i = files.length - 1; i >= 0; i--) {
        file = files[i];
        this.fileChanged.emit(file);
      }
    });
  }

}
