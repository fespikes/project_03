import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { TecApiService } from '../shared';
import { NodeFilter } from './node.model';

export class NodeServiceStub {
  private nodeDetails: Subject<any> = new Subject<any>();
  public nodeDetailsObservable = this.nodeDetails.asObservable();
  constructor(private api: TecApiService) { }
  manipulateNodeDetails(node) {
    this.nodeDetails.next(node);
  }
  fetchNodeList() {
    return Observable.of({
      options: {},
      pagination: {},
    });
  }

  fetchNodeSummary(): Observable<any> {
    return Observable.of({
      pagination: {},
    });
  }

  addNodeLabel(): Observable<any> {
    return Observable.of({});
  }

  removeLabel(): Observable<any> {
    return Observable.of({});
  }

  getNodePool(): Observable<any> {
    return Observable.of({});
  }

  getNodeDisks(): Observable<any> {
    return Observable.of({});
  }

  getStoreDetails(): Observable<any> {
    return Observable.of({});
  }

  getLocalDisks(): Observable<any> {
    return Observable.of({});
  }

}
