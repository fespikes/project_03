import {ɵgetDOM as getDOM} from '@angular/platform-browser';
import { MockBackend } from '@angular/http/testing';
import {
  tick,
  TestBed,
  ComponentFixture,
 } from '@angular/core/testing';
import { Router } from '@angular/router';

/*
 * Utility functions for our browser tests
 */
export function createEvent(eventType: any): Event {
  const evt: Event = document.createEvent('Event');
  evt.initEvent(eventType, true, true);
  return evt;
}

export function dispatchEvent(element: any, eventType: any) {
  element.dispatchEvent(createEvent(eventType));
}

export class ConsoleSpy {
  public logs: string[] = [];
  log(...args) {
    this.logs.push(args.join(' '));
  }
  warn(...args) {
    this.log(...args);
  }
}

export function expectURL(backend: MockBackend, url: string, response) {
  backend.connections.subscribe(c => {
    expect(c.request.url).toBe(url);

    c.mockRespond(new Response(<any>{body: response}));
  });
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

export function getProviders(services) {
  return [
  ];
}
