import {
  ActivatedRoute,
  Router, Routes,
  provideRoutes,
} from '@angular/router';
import {
  async,
  inject,
  fakeAsync,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateDeactivator, TranslateResolver, TranslateToken } from '../i18n';

import {
  TranslatePipeStub,
  DefaultPipeStub,
} from 'app/mock';
import {
  advance, createRoot,
  BlankComponent, RootComponent,
} from '../shared/test';
import { AccountComponent } from './account.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';

import { AccountModuleTest } from './account.module.test';
import { AccountService } from './account.service';
import { AccountServiceMock } from './account.service.mock';

const accountRoutes: Routes = [
{ path: '', component: BlankComponent },
{
  path: 'account',
  component: RootComponent,
  resolve: [TranslateResolver],
  canDeactivate: [TranslateDeactivator],
}];
// TODO: handle sub routers

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async(() => {
    const accountServiceMock: AccountServiceMock = new AccountServiceMock();

    TestBed.configureTestingModule({
      imports: [
        { // TODO RouterTestingModule.withRoutes coming soon
          ngModule: RouterTestingModule,
          providers: [provideRoutes(accountRoutes)],
        },
        AccountModuleTest,
      ],
      providers: [
        accountServiceMock.getProviders(),
        {
          provide: ActivatedRoute,
          useFactory: (r: Router) => r.routerState.root, deps: [ Router ],
        },
      ],
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('initialization', () => {
  });

});
