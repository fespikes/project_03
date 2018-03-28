import * as d3 from 'd3';
import { EventEmitter } from 'events';

import { SelectionType, CanvasContainer } from '../../core';
import { Tooltip } from './tooltip';
import { TooltipEvent } from './tooltip-event';

describe('tooltip', () => {
  let div;
  let tooltip: Tooltip;
  let overlaySelection: SelectionType;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
    overlaySelection = d3.select(div);
    tooltip = new Tooltip(overlaySelection);
    tooltip.draw();
  });

  afterEach(() => {
    document.body.removeChild(div);
  });

  it('should create', () => {
    expect(tooltip).toBeTruthy();
  });

  it('should set content', () => {
    const title = 'TITLE';
    const items = [{
      name: 'NAME',
      value: 'VALUE',
      color: 'white',
    }];
    tooltip.setContent(title, items);
    expect(tooltip.title.node().innerText).toBe(title);
    expect(tooltip.content.selectAll('.value').size()).toBe(1);
  });

  it('should be able to hide/show', () => {
    tooltip.hide();
    expectInvisible();
    tooltip.show();
    expectVisble();
  });

  describe('event', () => {
    let event;
    beforeEach(() => {
      event = new EventEmitter();
      tooltip.boundary({width: 300, height: 300}).subscribe(event);
    });

    it('should show and move tooltip when event emit mousemove', () => {
      expectInvisible();
      spyOn(tooltip, 'move');
      spyOn(tooltip, 'getOverlayMousePosition').and.returnValue([5, 10]);
      event.emit('mousemove', [5, 10]);
      expect(tooltip.move).toHaveBeenCalledWith(15, 20);
    });

    it('should hide tooltip when event emit mouseleave', () => {
      spyOn(tooltip, 'getOverlayMousePosition').and.returnValue([5, 10]);
      event.emit('mousemove', [5, 10]);
      expectVisble();
      event.emit('mouseleave');
      expectInvisible();
    });
  });

  function expectVisble() {
    expect(tooltip.tooltip.node().style.display).toBe('block');
  }

  function expectInvisible() {
    expect(tooltip.tooltip.node().style.display).toBe('none');
  }
});
