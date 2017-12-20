import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement,NO_ERRORS_SCHEMA } from '@angular/core';

import { NodeComponent } from './node.component';
import { NodeAsideComponent } from './node-aside/node-aside.component';
import { NodeService } from './node.service';

import { Observable } from 'rxjs/Observable';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { NodeServiceStub } from './node-aside/node-aside.component.spec'

describe('NodeComponent', () => {
  let nodeComponent: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],

      declarations: [ 
        NodeComponent,
        NodeAsideComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],

      providers: [{
        provide: NodeService,
        useClass: NodeServiceStub
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    nodeComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(nodeComponent).toBeTruthy();
  });
  
});
