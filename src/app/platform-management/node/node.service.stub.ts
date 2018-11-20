import { Observable ,  Subject } from 'rxjs';
import { TecApiService } from 'app/shared';
import { of } from 'rxjs';

export class NodeServiceStub {
  private nodeDetails: Subject<any> = new Subject<any>();
  public nodeDetailsObservable = this.nodeDetails.asObservable();
  constructor(private api: TecApiService) { }
  manipulateNodeDetails(node) {
    this.nodeDetails.next(node);
  }

  fetchNodeList() {
    return of({
      options: {},
      pagination: {},
    });
  }

  fetchNodeSummary(): Observable<any> {
    return of({
      pagination: {},
    });
  }

  addNodeLabel(): Observable<any> {
    return of({});
  }

  removeLabel(): Observable<any> {
    return of({});
  }

  getNodePool(): Observable<any> {
    return of({});
  }

  getNodeDisks(): Observable<any> {
    return of({});
  }

  getStoreDetails(): Observable<any> {
    return of({});
  }

  getLocalDisks(): Observable<any> {
    return of({});
  }

}
