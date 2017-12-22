import { Observable } from 'rxjs/Observable';

export class NodeServiceStub {
  fetchNodeList() {
    return Observable.of({
      pagination: {},
    });
  }

  fetchNodeSummary(): Observable<any> {
    return Observable.of({});
  }

}
