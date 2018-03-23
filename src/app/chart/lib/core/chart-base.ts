import * as d3 from 'd3';
import { Selection } from 'd3' ;

import { Overlay } from './overlay';
import { Rect2D } from '../helpers/transform-helper';
import { Layout } from './layout';

/**
 * @deprecated
 */
export abstract class ChartBase {

  abstract setConfig(config): ChartBase;

  abstract select(element: HTMLElement): ChartBase;

  abstract datum(datum): ChartBase;

  abstract draw(): ChartBase;
}

export type SelectionType = Selection<any, any, any, any>;

export class Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
