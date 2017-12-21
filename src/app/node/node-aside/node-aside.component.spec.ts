import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { NodeAsideComponent } from './node-aside.component';
import { NodeService } from '../node.service';
import { NodeFilter } from '../node.model';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';

import { NodeServiceStub } from '../node.service.stub';

describe('NodeAsideComponent', () => {
  let component: NodeAsideComponent;
  let fixture: ComponentFixture<NodeAsideComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],

      declarations: [
        NodeAsideComponent,
        TranslatePipeStub,
        DefaultPipeStub,
      ],

      providers: [
        {
          provide: NodeService,
          useClass: NodeServiceStub,
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAsideComponent);
    component = fixture.componentInstance;
    component.filter = new NodeFilter;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
