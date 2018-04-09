import {
  Component,
  HostBinding,
  ViewChild,
  ContentChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';

const MOVE_STEP = 300;
const NAV_WIDTH = 16;

@Component({
  selector: 'tec-overflow-container',
  templateUrl: './overflow-container.component.html',
  styleUrls: ['./overflow-container.component.sass'],
})
export class OverflowContainerComponent {
  @HostBinding('class.tui-overflow-container') hostClass = true;
  @ViewChild('containerBody') containerBody: ElementRef;
  @ViewChild('overflowContent') overflowContent: ElementRef;

  private offsetX = 0;

  get canMoveLeft() {
    return this.offsetX > 0;
  }

  get canMoveRight() {
    return this.containerBody.nativeElement.scrollWidth - this.containerBody.nativeElement.clientWidth > 0;
  }

  constructor(
    private change: ChangeDetectorRef,
    private render: Renderer2,
  ) { }

  moveLeft() {
    this.offsetX = this.offsetX < MOVE_STEP ? 0 : this.offsetX - MOVE_STEP;
    this.render.setStyle(this.overflowContent.nativeElement, 'transform', `translate(-${this.offsetX}px, 0)`);
    setTimeout(() => { // update view after animation ends
      this.change.detectChanges();
    }, 600);
  }

  moveRight() {
    const remainOffsetX = this.containerBody.nativeElement.scrollWidth - this.containerBody.nativeElement.clientWidth + NAV_WIDTH;
    this.offsetX = Math.min(this.offsetX + remainOffsetX, this.offsetX + MOVE_STEP);
    this.render.setStyle(this.overflowContent.nativeElement, 'transform', `translate(-${this.offsetX}px, 0)`);
    setTimeout(() => { // update view after animation ends
      this.change.detectChanges();
    }, 600);
  }
}
