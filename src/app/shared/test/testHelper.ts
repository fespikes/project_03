/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import {
  tick,
  TestBed,
  ComponentFixture,
 } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as path from 'path';

import { environment } from '../../../environments/environment';
export const makeUrl = (url) => {
  return path.join(environment.apiUrl, url);
};

export interface GuinessCompatibleSpy extends jasmine.Spy {
  /** By chaining the spy with and.returnValue, all calls to the function will return a specific
   * value. */
  andReturn(val: any): void;
  /** By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied
   * function. */
  andCallFake(fn: Function): GuinessCompatibleSpy;
  /** removes all recorded calls */
  reset();
}

export class SpyObject {

  static stub(object: any = null, config: any = null, overrides: any = null) {
    if (!(object instanceof SpyObject)) {
      overrides = config;
      config = object;
      object = new SpyObject();
    }

    const m = {...config, ...overrides};
    Object.keys(m).forEach(key => { object.spy(key).and.returnValue(m[key]); });
    return object;
  }

  constructor(type?: any) {
    if (type) {
      for (const prop of type.prototype) {
        let m: any = null;
        m = type.prototype[prop];
        if (typeof m === 'function') {
          this.spy(prop);
        }
      }
    }
  }

  spy(name: string) {
    if (!(this as any)[name]) {
      // (this as any)[name] = jasmine.createSpy(name);
      (this as any)[name] = this._createGuinnessCompatibleSpy(name);
    }
    return (this as any)[name];
  }

  prop(name: string, value: any) { (this as any)[name] = value; }


  /** @internal */
  _createGuinnessCompatibleSpy(name): GuinessCompatibleSpy {
    const newSpy: GuinessCompatibleSpy = <any>jasmine.createSpy(name);
    newSpy.andCallFake = <any>newSpy.and.callFake;
    newSpy.andReturn = <any>newSpy.and.returnValue;
    newSpy.reset = <any>newSpy.calls.reset;
    // revisit return null here (previously needed for rtts_assert).
    newSpy.and.returnValue(null);
    return newSpy;
  }

}

@Component({
  selector: 'tec-blank-cmp',
  template: ``,
})
export class BlankComponent {
}

@Component({
  selector: 'tec-root-cmp',
  template: `<router-outlet></router-outlet>`,
})
export class RootComponent {
}

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

export function createRoot(router: Router,
                           componentType: any): ComponentFixture<any> {
  const f = TestBed.createComponent(componentType);
  advance(f);
  (<any>router).initialNavigation();
  console.log('router after initial:', router);
  // advance(f);
  return f;
}
