import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import {
  Http,
  ConnectionBackend,
  BaseRequestOptions,
  Response,
  ResponseOptions,
} from '@angular/http';
import { Overlay } from '@angular/cdk/overlay';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

import { TuiMessageService } from 'tdc-ui';
import { TranslatePipeStub, DefaultPipeStub } from 'app/mock';
import {
  ConsoleSpy,
  dispatchEvent,
  createEvent,
} from '../../shared/test';
import { TranslateService } from '../../i18n/translate.service';

import { ChangePwdComponent } from './change-pwd.component';
import { AccountService } from '../account.service';
import { TecApiService } from '../../shared';

describe('ChangePwdComponent', () => {
  let component: ChangePwdComponent;
  let fixture: ComponentFixture<ChangePwdComponent>;

  let originalConsole, fakeConsole;
  let el, msgs, formEl;
  let passwordIpt, newPasswordIpt, confirmIpt;

  beforeEach(async(() => {
    fakeConsole = new ConsoleSpy();
    originalConsole = window.console;
    (<any>window).console = fakeConsole;

    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
      ],
      declarations: [
        TranslatePipeStub,  // no translation
        DefaultPipeStub,
        ChangePwdComponent,
      ],
      providers: [
        AccountService,
        TecApiService,
        TuiMessageService,
        {
          provide: TranslateService,
          useValue: {
            use() { },
          },
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // restores the real console
  afterAll(() => (<any>window).console = originalConsole);

  function createComponent(): ComponentFixture<any> {
    const f: ComponentFixture<ChangePwdComponent> = TestBed.createComponent(ChangePwdComponent);
    el = f.debugElement.nativeElement;
    passwordIpt = el.querySelector('#passwordId'),
    newPasswordIpt = el.querySelector('#newPasswordId'),
    confirmIpt = el.querySelector('#confirmId');

    f.detectChanges();

    return f;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form', () => {
    describe('old password', () => {
      it('displays errors with input blank old password', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();
        passwordIpt.value = '123';
        dispatchEvent(passwordIpt, 'input');

        passwordIpt.value = '';
        dispatchEvent(passwordIpt, 'input');
        dispatchEvent(passwordIpt, 'blur');
        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs[0].innerHTML).toContain('ACCOUNT.ORIGINAL_PWD_TIP');
      }));
    });

    describe('new password', () => {
      it('displays errors when new password blank', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();

        newPasswordIpt.value = '';
        dispatchEvent(newPasswordIpt, 'input');
        dispatchEvent(newPasswordIpt, 'blur');

        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs[0].innerHTML).toContain('ACCOUNT.NEW_PWD_TIP_REQUIRED');
      }));

      it('displays errors when new password wrong pattern: all number', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();
        passwordIpt.value = '123';
        dispatchEvent(passwordIpt, 'input');

        newPasswordIpt.value = '123456';
        dispatchEvent(newPasswordIpt, 'input');
        dispatchEvent(newPasswordIpt, 'blur');

        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs[0].innerHTML).toContain('ACCOUNT.NEW_PWD_PLACEHOLDER');
      }));

      it('displays errors when new password wrong pattern: all letter', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();
        passwordIpt.value = '123';
        dispatchEvent(passwordIpt, 'input');

        newPasswordIpt.value = 'abcderg';
        dispatchEvent(newPasswordIpt, 'input');
        dispatchEvent(newPasswordIpt, 'blur');

        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs[0].innerHTML).toContain('ACCOUNT.NEW_PWD_PLACEHOLDER');
      }));

      it('no errors when new password matches pattern', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();
        passwordIpt.value = '123';
        dispatchEvent(passwordIpt, 'input');

        newPasswordIpt.value = '123abc';
        dispatchEvent(newPasswordIpt, 'input');
        dispatchEvent(newPasswordIpt, 'blur');

        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs.length).toEqual(0);
      }));
    });

    describe(' confirm password', () => {
      it('display error with blank confirm password', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();
        passwordIpt.value = '123';
        dispatchEvent(passwordIpt, 'input');

        newPasswordIpt.value = '123abc';
        dispatchEvent(newPasswordIpt, 'input');

        confirmIpt.value = '';
        dispatchEvent(confirmIpt, 'input');
        dispatchEvent(confirmIpt, 'blur');
        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs[0].innerHTML).toContain('ACCOUNT.CONFIRM_PWD_TIP');
      }));

      it('display error with different confirm password', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();
        passwordIpt.value = '123';
        dispatchEvent(passwordIpt, 'input');

        newPasswordIpt.value = '123abc';
        dispatchEvent(newPasswordIpt, 'input');

        confirmIpt.value = '123456';
        dispatchEvent(confirmIpt, 'input');
        dispatchEvent(confirmIpt, 'blur');
        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs[0].innerHTML).toContain('ACCOUNT.CONFIRM_PWD_TIP');
      }));

      it('no error when confirm password is the same', fakeAsync(() => {
        const f: ComponentFixture<ChangePwdComponent> = createComponent();
        passwordIpt.value = '123';
        dispatchEvent(passwordIpt, 'input');

        newPasswordIpt.value = '123abc';
        dispatchEvent(newPasswordIpt, 'input');

        confirmIpt.value = '123abc';
        dispatchEvent(confirmIpt, 'input');
        dispatchEvent(confirmIpt, 'blur');
        f.detectChanges();

        msgs = el.querySelectorAll('.message');
        expect(msgs.length).toEqual(0);
      }));
    });

    /**
    * failure
    * error of : TypeError: Cannot read property 'bind' of undefined
    */
    it('handle form submission', fakeAsync(() => {

      const f = createComponent();
      formEl = fixture.debugElement.query(By.css('form')).nativeElement;

      passwordIpt.value = '123';
      dispatchEvent(passwordIpt, 'input');

      newPasswordIpt.value = '123abc';
      dispatchEvent(newPasswordIpt, 'input');

      confirmIpt.value = '123abc';
      dispatchEvent(confirmIpt, 'input');
      dispatchEvent(confirmIpt, 'blur');

      f.detectChanges();
      tick();

    }));
  });


});
