import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiModalService, TuiMessageService, TuiModalRef } from 'tdc-ui';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import { TranslateService } from 'app/i18n';
import { MockModule, TranslateServiceMock } from 'app/mock';
import { NetworkComponent } from './network.component';
import { NetworkService } from './network.service';
import { TecApiService } from 'app/shared';

describe('NetworkComponent', () => {
  let component: NetworkComponent;
  let fixture: ComponentFixture<NetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule
      ],
      declarations: [
        NetworkComponent,
        TranslatePipeStub,
        DefaultPipeStub
      ],
      providers: [
        TuiModalRef,
        TuiMessageService,
        TecApiService,
        NetworkService,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
